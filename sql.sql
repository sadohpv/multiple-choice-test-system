--
-- PostgreSQL database dump
--

\restrict waeauUvCtwgLtgPaDt9EM4dcDXeDA6gSbx2AhfcFNLOiTg2a57iUJ6vztxq1Nc1

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-17 12:06:28

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16456)
-- Name: Answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Answers" (
    id bigint NOT NULL,
    desciption text NOT NULL,
    question_id bigint NOT NULL,
    valid boolean,
    "createdAt" bigint,
    "updateAt" bigint
);


ALTER TABLE public."Answers" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16464)
-- Name: Exam; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Exam" (
    id bigint NOT NULL,
    code bit varying(10) NOT NULL,
    active boolean DEFAULT true,
    subject_id bigint NOT NULL,
    creator_id bigint NOT NULL,
    "createdAt" bigint
);


ALTER TABLE public."Exam" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16472)
-- Name: Questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Questions" (
    id bigint NOT NULL,
    description text NOT NULL,
    "createdAt" bigint,
    "updatedAt" bigint,
    difficult integer,
    subject_id bigint NOT NULL
);


ALTER TABLE public."Questions" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16480)
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    id bigint NOT NULL,
    role_name character varying(50) NOT NULL,
    description character varying(50),
    "createdAt" bigint,
    "updatedAt" bigint
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16485)
-- Name: Score; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Score" (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    exam_id bigint NOT NULL,
    "time" bigint,
    score integer
);


ALTER TABLE public."Score" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16491)
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    exam_id bigint NOT NULL,
    "time" bigint NOT NULL,
    status "char"[],
    answered boolean[]
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16500)
-- Name: Subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subject" (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" bigint
);


ALTER TABLE public."Subject" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16505)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id bigint CONSTRAINT "User_id_not_null" NOT NULL,
    username character varying(100) CONSTRAINT "User_username_not_null" NOT NULL,
    avatar text,
    password text CONSTRAINT "User_password_not_null" NOT NULL,
    email character varying(200) CONSTRAINT "User_email_not_null" NOT NULL,
    "createdAt" bigint,
    "updatedAt" bigint,
    displayname character varying(100)
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16514)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 227
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 228 (class 1259 OID 16515)
-- Name: Users_Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users_Roles" (
    id bigint CONSTRAINT "User_Roles_id_not_null" NOT NULL,
    user_id bigint CONSTRAINT "User_Roles_user_id_not_null" NOT NULL,
    role_id bigint CONSTRAINT "User_Roles_role_id_not_null" NOT NULL,
    "createdAt" bigint
);


ALTER TABLE public."Users_Roles" OWNER TO postgres;

--
-- TOC entry 4889 (class 2604 OID 16521)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 5069 (class 0 OID 16456)
-- Dependencies: 219
-- Data for Name: Answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Answers" (id, desciption, question_id, valid, "createdAt", "updateAt") FROM stdin;
\.


--
-- TOC entry 5070 (class 0 OID 16464)
-- Dependencies: 220
-- Data for Name: Exam; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Exam" (id, code, active, subject_id, creator_id, "createdAt") FROM stdin;
\.


--
-- TOC entry 5071 (class 0 OID 16472)
-- Dependencies: 221
-- Data for Name: Questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Questions" (id, description, "createdAt", "updatedAt", difficult, subject_id) FROM stdin;
\.


--
-- TOC entry 5072 (class 0 OID 16480)
-- Dependencies: 222
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" (id, role_name, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5073 (class 0 OID 16485)
-- Dependencies: 223
-- Data for Name: Score; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Score" (id, user_id, exam_id, "time", score) FROM stdin;
\.


--
-- TOC entry 5074 (class 0 OID 16491)
-- Dependencies: 224
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, user_id, exam_id, "time", status, answered) FROM stdin;
\.


--
-- TOC entry 5075 (class 0 OID 16500)
-- Dependencies: 225
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subject" (id, name, "createdAt") FROM stdin;
\.


--
-- TOC entry 5076 (class 0 OID 16505)
-- Dependencies: 226
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, username, avatar, password, email, "createdAt", "updatedAt", displayname) FROM stdin;
1	hung	https://example.com/avatar.jpg	123	hung@123.com	1776259468360	1776259468360	\N
2	truonganh	https://example.com/avatar.jpg	1234	truonganh@123.com	1776260551977	1776260551977	\N
3	tuan	https://example.com/avatar.jpg	1234	tuan@123.com	1776260591177	1776260591177	\N
5	thuan	https://example.com/avatar.jpg	1234	thuan@123.com	1776353798723	1776353798723	\N
6	abc	https://example.com/avatar.jpg	1234	xyz@123.com	1776353844376	1776353844376	Yasuo
4	tuan2	https://example.com/avatar.jpg	1234	tuan2@123.com	1776353765430	1776353765430	\N
\.


--
-- TOC entry 5078 (class 0 OID 16515)
-- Dependencies: 228
-- Data for Name: Users_Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users_Roles" (id, user_id, role_id, "createdAt") FROM stdin;
\.


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 227
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- TOC entry 4899 (class 2606 OID 16523)
-- Name: Score Score_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT "Score_pkey" PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16525)
-- Name: Answers answer_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT answer_id PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 16527)
-- Name: Exam exam_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT exam_id PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16529)
-- Name: Questions question_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT question_id PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 16531)
-- Name: Roles role_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT role_id PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 16533)
-- Name: Session session_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT session_id PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 16535)
-- Name: Subject subject_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT subject_id PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16597)
-- Name: Users uk_users_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT uk_users_email UNIQUE (email);


--
-- TOC entry 4907 (class 2606 OID 16595)
-- Name: Users uk_users_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT uk_users_username UNIQUE (username);


--
-- TOC entry 4909 (class 2606 OID 16537)
-- Name: Users user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- TOC entry 4911 (class 2606 OID 16539)
-- Name: Users_Roles user_role_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT user_role_id PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 16540)
-- Name: Exam creator_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT creator_id FOREIGN KEY (creator_id) REFERENCES public."Users"(id);


--
-- TOC entry 4916 (class 2606 OID 16545)
-- Name: Score exam_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT exam_id FOREIGN KEY (exam_id) REFERENCES public."Exam"(id) NOT VALID;


--
-- TOC entry 4918 (class 2606 OID 16550)
-- Name: Session exam_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT exam_id FOREIGN KEY (exam_id) REFERENCES public."Exam"(id);


--
-- TOC entry 4920 (class 2606 OID 16555)
-- Name: Users_Roles fk_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public."Roles"(id) NOT VALID;


--
-- TOC entry 4921 (class 2606 OID 16560)
-- Name: Users_Roles fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- TOC entry 4912 (class 2606 OID 16565)
-- Name: Answers question_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT question_id FOREIGN KEY (question_id) REFERENCES public."Questions"(id);


--
-- TOC entry 4914 (class 2606 OID 16570)
-- Name: Exam subject_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT subject_id FOREIGN KEY (subject_id) REFERENCES public."Subject"(id);


--
-- TOC entry 4915 (class 2606 OID 16575)
-- Name: Questions subject_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT subject_id FOREIGN KEY (subject_id) REFERENCES public."Subject"(id) NOT VALID;


--
-- TOC entry 4917 (class 2606 OID 16580)
-- Name: Score user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(id) NOT VALID;


--
-- TOC entry 4919 (class 2606 OID 16585)
-- Name: Session user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(id);


-- Completed on 2026-04-17 12:06:29

--
-- PostgreSQL database dump complete
--

\unrestrict waeauUvCtwgLtgPaDt9EM4dcDXeDA6gSbx2AhfcFNLOiTg2a57iUJ6vztxq1Nc1

