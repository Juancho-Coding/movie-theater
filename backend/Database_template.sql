CREATE SEQUENCE IF NOT EXISTS public.movies_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.auditoriums_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.movies
(
    id integer NOT NULL DEFAULT nextval('movies_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" DEFAULT ''::character varying,
    duration integer DEFAULT 0,
    imageurl character varying COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    release_date date NOT NULL,
    status integer NOT NULL DEFAULT 0,
    rating character varying COLLATE pg_catalog."default" DEFAULT ''::character varying,
    language character varying COLLATE pg_catalog."default" DEFAULT ''::character varying,
    doubled boolean DEFAULT false,
    chips character varying[] COLLATE pg_catalog."default" DEFAULT '{}'::character varying[],
    CONSTRAINT movies_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.auditoriums
(
    id integer NOT NULL DEFAULT nextval('auditoriums_id_seq'::regclass),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    total_seats integer NOT NULL DEFAULT 0,
    rows integer NOT NULL DEFAULT 1,
    columns integer NOT NULL DEFAULT 1,
    CONSTRAINT auditoriums_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users
(
    userid uuid NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    level integer NOT NULL DEFAULT 0,
    CONSTRAINT users_pkey PRIMARY KEY (userid)
);

CREATE TABLE IF NOT EXISTS public.schedules
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    movie_id integer NOT NULL,
    auditorium_id integer,
    show_date date NOT NULL,
    show_time time without time zone,
    price numeric DEFAULT 0,
    CONSTRAINT schedules_pkey PRIMARY KEY (id),
    CONSTRAINT schedules_audit_fk FOREIGN KEY (auditorium_id)
        REFERENCES public.auditoriums (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT schedules_movie_fk FOREIGN KEY (movie_id)
        REFERENCES public.movies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE IF NOT EXISTS public.reservations
(
    id uuid NOT NULL,
    schedule_id character varying COLLATE pg_catalog."default" NOT NULL,
    user_id uuid NOT NULL,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    expires_at timestamp without time zone NOT NULL DEFAULT now(),
    seat_row integer NOT NULL,
    seat_col integer NOT NULL,
    session integer,
    CONSTRAINT reservations_pkey PRIMARY KEY (id),
    CONSTRAINT schedule_fkey FOREIGN KEY (schedule_id)
        REFERENCES public.schedules (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT user_reservation_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)