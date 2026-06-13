interface Props {
  title: string;
  description?: string;
}

// Временная заглушка экрана (Фаза 3). По мере прохождения роадмапа каждый
// такой экран заменяется реальной композицией (widgets/views).
export const PageStub = ({ title, description }: Props) => {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description ? (
        <p className="mt-2 text-muted-foreground">{description}</p>
      ) : null}
      <p className="mt-6 text-sm text-muted-foreground">Экран в разработке.</p>
    </main>
  );
};
