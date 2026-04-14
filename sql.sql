--
-- PostgreSQL database dump
--

\restrict STlZeXQ4gPZzTnhgRUOXQfDi9Wkd8PRxH6yGkHby9fbl8EepqckiFFEymqtugKf

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-13 22:22:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16443)
-- Name: Answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Answers" (
    id bigint NOT NULL,
    desciption text NOT NULL,
    question_id bigint NOT NULL,
    valid boolean,
    "createdAt" bigint,
    "updateAt" bigint
);


--
-- TOC entry 226 (class 1259 OID 24592)
-- Name: Exam; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Exam" (
    id bigint NOT NULL,
    code bit varying(10) NOT NULL,
    active boolean DEFAULT true,
    subject_id bigint NOT NULL,
    creator_id bigint NOT NULL,
    "createdAt" bigint
);


--
-- TOC entry 223 (class 1259 OID 16434)
-- Name: Questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Questions" (
    id bigint NOT NULL,
    description text NOT NULL,
    "createdAt" bigint,
    "updatedAt" bigint,
    difficult integer,
    subject_id bigint NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: Roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Roles" (
    id bigint NOT NULL,
    role_name character varying(50) NOT NULL,
    description character varying(50),
    "createdAt" bigint,
    "updatedAt" bigint
);


--
-- TOC entry 228 (class 1259 OID 24633)
-- Name: Score; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Score" (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    exam_id bigint NOT NULL,
    "time" bigint,
    score integer
);


--
-- TOC entry 227 (class 1259 OID 24612)
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    exam_id bigint NOT NULL,
    "time" bigint NOT NULL,
    status "char"[],
    answered boolean[]
);


--
-- TOC entry 225 (class 1259 OID 24576)
-- Name: Subject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Subject" (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" bigint
);


--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id bigint CONSTRAINT "User_id_not_null" NOT NULL,
    username character varying(100) CONSTRAINT "User_username_not_null" NOT NULL,
    avatar text,
    password text CONSTRAINT "User_password_not_null" NOT NULL,
    email character varying(200) CONSTRAINT "User_email_not_null" NOT NULL,
    "createdAt" bigint,
    "updatedAt" bigint
);


--
-- TOC entry 219 (class 1259 OID 16388)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 222 (class 1259 OID 16416)
-- Name: Users_Roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users_Roles" (
    id bigint CONSTRAINT "User_Roles_id_not_null" NOT NULL,
    user_id bigint CONSTRAINT "User_Roles_user_id_not_null" NOT NULL,
    role_id bigint CONSTRAINT "User_Roles_role_id_not_null" NOT NULL,
    "createdAt" bigint
);


--
-- TOC entry 4888 (class 2604 OID 32836)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 4907 (class 2606 OID 24638)
-- Name: Score Score_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT "Score_pkey" PRIMARY KEY (id);


--
-- TOC entry 4899 (class 2606 OID 16452)
-- Name: Answers answer_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT answer_id PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 24601)
-- Name: Exam exam_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT exam_id PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 16442)
-- Name: Questions question_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT question_id PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 16407)
-- Name: Roles role_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT role_id PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 24622)
-- Name: Session session_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT session_id PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 24585)
-- Name: Subject subject_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT subject_id PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16400)
-- Name: Users user_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16423)
-- Name: Users_Roles user_role_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT user_role_id PRIMARY KEY (id);


--
-- TOC entry 4912 (class 2606 OID 24607)
-- Name: Exam creator_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT creator_id FOREIGN KEY (creator_id) REFERENCES public."Users"(id);


--
-- TOC entry 4916 (class 2606 OID 24646)
-- Name: Score exam_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT exam_id FOREIGN KEY (exam_id) REFERENCES public."Exam"(id) NOT VALID;


--
-- TOC entry 4914 (class 2606 OID 24628)
-- Name: Session exam_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT exam_id FOREIGN KEY (exam_id) REFERENCES public."Exam"(id);


--
-- TOC entry 4908 (class 2606 OID 16429)
-- Name: Users_Roles fk_role; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public."Roles"(id) NOT VALID;


--
-- TOC entry 4909 (class 2606 OID 16424)
-- Name: Users_Roles fk_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- TOC entry 4911 (class 2606 OID 16453)
-- Name: Answers question_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT question_id FOREIGN KEY (question_id) REFERENCES public."Questions"(id);


--
-- TOC entry 4913 (class 2606 OID 24602)
-- Name: Exam subject_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT subject_id FOREIGN KEY (subject_id) REFERENCES public."Subject"(id);


--
-- TOC entry 4910 (class 2606 OID 24587)
-- Name: Questions subject_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT subject_id FOREIGN KEY (subject_id) REFERENCES public."Subject"(id) NOT VALID;


--
-- TOC entry 4917 (class 2606 OID 24641)
-- Name: Score user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(id) NOT VALID;


--
-- TOC entry 4915 (class 2606 OID 24623)
-- Name: Session user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(id);


-- Completed on 2026-04-13 22:22:22

--
-- PostgreSQL database dump complete
--

\unrestrict STlZeXQ4gPZzTnhgRUOXQfDi9Wkd8PRxH6yGkHby9fbl8EepqckiFFEymqtugKf

