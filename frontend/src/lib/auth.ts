const TOKEN_KEY = 'medidas:accessToken';
const NOME_KEY = 'medidas:nome';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NOME_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getNome(): string | null {
  return localStorage.getItem(NOME_KEY);
}

export function setNome(nome: string): void {
  localStorage.setItem(NOME_KEY, nome);
}
