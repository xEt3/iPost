export interface RespuestaPosts {
    ok: boolean;
    posts: Post[];
}

export interface Post {
    imgs?: string[];
    _id?: string;
    mensaje?: string;
    coords?: string;
    usuario?: Usuario;
    created?: string;
    likes?:string[];
}

export interface Usuario {
    avatar?: string;
    _id?: string;
    nombre?: string;
    email?: string;
    password?: string;
}

