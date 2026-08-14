interface PlaceholderScreenProps {
  label: string
}

export function PlaceholderScreen({ label }: PlaceholderScreenProps) {
  return (
    <header className="px-5 pt-7 pb-4">
      <h1 className="text-xl font-bold text-foreground">{label}</h1>
      <p className="text-muted-foreground text-sm mt-0.5">Pantalla en construcción</p>
    </header>
  )
}