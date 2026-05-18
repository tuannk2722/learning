import { redirect } from "next/navigation";

type Params = Promise<{ courseId: string; lessonId: string }>;

export default async function QuizResultRedirect(props: { params: Params }) {
  const params = await props.params;
  redirect(`/dashboard/courses/${params.courseId}/lesson/${params.lessonId}/quiz`);
}