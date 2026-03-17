import EditorClient from '@/components/Editor/EditorClient';

interface Props {
  params: { id: string };
}

export default function EditorPage({ params }: Props) {
  return <EditorClient id={params.id} />;
}
