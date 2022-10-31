export type AuthForm = {
  email: string
  password: string
}

export type EditTask = {
  id: number
  title: string
  description?: string | null
}
