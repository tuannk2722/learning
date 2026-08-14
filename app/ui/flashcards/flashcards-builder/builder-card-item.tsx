'use client';

import { motion } from "motion/react";
import { Trash2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { uploadFlashcardImage } from "@/app/lib/actions/upload";
import { useFieldSuggestions } from "@/app/hooks/use-term-suggestions";
import { SuggestionDropdown } from "./suggestion-dropdown";
import { ImagePickerInline } from "./image-picker-inline";

export interface EditableCard {
  id: string;
  front: string;
  back: string;
  imageUrl: string;
}

export interface BuilderCardItemHandle {
  focusTerm: () => void;
}

interface BuilderCardItemProps {
  card: EditableCard;
  index: number;
  canDelete: boolean;
  termLang?: string;
  defLang?: string;
  onUpdate: (id: string, field: keyof EditableCard, value: string) => void;
  onDelete: (id: string) => void;
}

export const BuilderCardItem = forwardRef<BuilderCardItemHandle, BuilderCardItemProps>(function BuilderCardItem({
  card,
  index,
  canDelete,
  termLang = 'en-US',
  defLang = 'en-US',
  onUpdate,
  onDelete,
}, ref) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Suggestions for Term (based on Definition)
  const termSuggestions = useFieldSuggestions({
    sourceText: card.back,
    sourceLang: defLang,
    targetLang: termLang,
  });

  // Suggestions for Definition (based on Term)
  const defSuggestions = useFieldSuggestions({
    sourceText: card.front,
    sourceLang: termLang,
    targetLang: defLang,
  });

  const isAnyOpen = termSuggestions.isOpen || defSuggestions.isOpen;

  useImperativeHandle(ref, () => ({
    focusTerm: () => {
      textareaRef.current?.focus();
    },
  }));

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize(textareaRef.current);
    autoResize(backTextareaRef.current);
  }, [card.front, card.back]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, WEBP, and GIF images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadFlashcardImage(formData);
      if (res.success && res.url) {
        onUpdate(card.id, "imageUrl", res.url);
      } else {
        alert(res.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during image upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(card.id, "imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={`bg-white rounded-2xl border-2 transition-all shadow-sm shadow-violet-100 ${
        isAnyOpen ? 'relative z-30 ring-2 ring-violet-200/50' : 'relative z-0'
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-600">{index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDelete(card.id)}
            disabled={!canDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            title="Delete card"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card inputs */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front (Term) */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={card.front}
              onChange={(e) => {
                onUpdate(card.id, "front", e.target.value);
                termSuggestions.close();
              }}
              onClick={() => {
                termSuggestions.trigger();
              }}
              onFocus={() => {
                termSuggestions.trigger();
              }}
              placeholder="E.g: Photosynthesis"
              rows={1}
              className="rounded-xl w-full px-3 py-3 text-base font-semibold text-gray-900 bg-transparent resize-none focus:outline-none placeholder:text-gray-200 placeholder:font-normal border-b border-gray-200 focus:border-violet-300 transition-colors whitespace-pre-wrap"
            />
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest mt-1 block">
              Term
            </label>

            {/* Term Suggestions Dropdown */}
            <SuggestionDropdown
              isOpen={termSuggestions.isOpen}
              suggestions={termSuggestions.suggestions}
              onSelect={(text) => onUpdate(card.id, "front", text)}
              onClose={termSuggestions.close}
            />
          </div>

          {/* Back (Definition) */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <textarea
                ref={backTextareaRef}
                value={card.back}
                onChange={(e) => {
                  onUpdate(card.id, "back", e.target.value);
                  defSuggestions.close();
                }}
                onClick={() => {
                  defSuggestions.trigger();
                }}
                onFocus={() => {
                  defSuggestions.trigger();
                }}
                placeholder="E.g: abc"
                rows={1}
                className="rounded-xl w-full px-3 py-3 text-base font-semibold text-gray-900 bg-transparent resize-none focus:outline-none placeholder:text-gray-200 placeholder:font-normal border-b border-gray-200 focus:border-violet-300 transition-colors whitespace-pre-wrap"
              />
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest mt-1 block">
                Definition
              </label>

              {/* Definition Suggestions Dropdown */}
              <SuggestionDropdown
                isOpen={defSuggestions.isOpen}
                suggestions={defSuggestions.suggestions}
                onSelect={(text) => onUpdate(card.id, "back", text)}
                onClose={defSuggestions.close}
              />
            </div>

            {/* Image Upload Area */}
            <div className="flex-shrink-0">
              {isUploading ? (
                <div className="w-16 h-16 border-2 border-dashed border-violet-300 rounded-xl flex items-center justify-center bg-violet-50 text-violet-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : card.imageUrl ? (
                <div className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center group">
                  <img
                    src={card.imageUrl}
                    alt="Card preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  {/* Hover overlay to delete */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1 rounded-full bg-white/90 hover:bg-white text-red-500 hover:scale-110 transition-transform"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowImagePicker((p) => !p)}
                  className={`w-16 h-16 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
                    showImagePicker
                      ? 'border-violet-400 bg-violet-50 text-violet-500'
                      : 'border-gray-300 hover:border-violet-300 hover:bg-violet-50 text-gray-600 hover:text-violet-400'
                  }`}
                  title="Add image"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-[10px] leading-none font-medium">Image</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inline Image Picker */}
        <ImagePickerInline
          isOpen={showImagePicker}
          initialQuery={card.front}
          termLang={termLang}
          onSelect={(url) => onUpdate(card.id, "imageUrl", url)}
          onUploadClick={handleImageClick}
          onClose={() => setShowImagePicker(false)}
        />
      </div>
    </motion.div>
  );
});
