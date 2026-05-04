import { redirect } from "next/navigation";

type Params = Promise<{ courseId: string; lessonId: string }>;

// Redirect old /result URL to quiz page (no longer supports base64 data)
export default async function QuizResultRedirect(props: { params: Params }) {
  const params = await props.params;
  redirect(`/dashboard/courses/${params.courseId}/lesson/${params.lessonId}/quiz`);
}