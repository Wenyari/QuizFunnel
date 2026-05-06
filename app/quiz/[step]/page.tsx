export default function StepPage({ params }: { params: { step: string } }) {
  return (
    <div>
      <h1>Quiz Step: {params.step}</h1>
    </div>
  );
}
