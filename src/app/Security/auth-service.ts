import { computed, Injectable, signal } from '@angular/core';
import { LoginToken } from '../Interface/login-token';
import { LoginService } from '../Service/login-service';
import { LoginInterface } from '../Interface/login-interface';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //Si el usuario ya estaba logueado y recargó la página, el signal arranca con el token existente en vez de null.
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  //Expone una versión de solo lectura del signal. Cualquier clase (como el interceptor) puede leer authService.token(),
  //pero no puede escribirle — solo AuthService mismo puede cambiarlo, mediante setSession/logout.
  token = this.tokenSignal.asReadonly();

  //Un computed se recalcula solo cada vez que tokenSignal cambia.
  //!!valor lo convierte a booleano puro: true si hay algún string, false si es null.
  isLoggedIn = computed(() => !!this.tokenSignal());

  //Decodifica el JWT (sin verificar firma — eso ya lo hizo el backend, acá solo se lee para mostrar cosas en pantalla) y saca el array authorities.
  //El try/catch evita que la app explote si el token viene corrupto; el ?? [] cubre el caso de que authorities venga undefined.
  roles = computed<string[]>(() => {
    const token = this.tokenSignal();
    if (!token) return [];
    try {
      return jwtDecode<LoginToken>(token).authorities ?? [];
    } catch {
      return [];
    }
  });

  //si el array de roles contiene ese string — para usar en el HTML y esconder/mostrar botones.
  isAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));

  constructor(private loginService: LoginService) {}

  //Delega el HTTP real a LoginService, y con tap "espía" la respuesta sin modificarla: apenas llega bien, guarda la sesión como efecto secundario.
  //El método sigue devolviendo el observable completo, para que quien lo llame pueda usar la respuesta
  login(id: string, password: string) {
    return this.loginService.login(id, password)
      .pipe(tap(res => this.setSession(res)));
  }

  //Guarda en dos lugares a la vez: localStorage (sobrevive un refresh) y el signal (dispara la reactividad al
  // instante, sin esperar un reload).
  private setSession(res: LoginInterface) {
    localStorage.setItem('token', res.token);
    this.tokenSignal.set(res.token);
  }

  //Limpia los dos — isLoggedIn y roles se actualizan solos en toda la app apenas esto corre.
  logout() {
    localStorage.removeItem('token');
    this.tokenSignal.set(null);
  }
}
