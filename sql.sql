--
-- PostgreSQL database dump
--

\restrict HqXMkEITvu580yI1xekmg3ifGmKiy3DweujyGwyLOOq1CmHYZqytosrM2vP6zhd

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-08 01:28:35

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
-- TOC entry 219 (class 1259 OID 24805)
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
-- TOC entry 230 (class 1259 OID 24944)
-- Name: AuditLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLogs" (
    id bigint NOT NULL,
    user_id bigint,
    username character varying(100),
    action character varying(100) NOT NULL,
    target_type character varying(100),
    target_id character varying(50),
    detail text,
    "createdAt" bigint NOT NULL
);


ALTER TABLE public."AuditLogs" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24943)
-- Name: AuditLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuditLogs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuditLogs_id_seq" OWNER TO postgres;

--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 229
-- Name: AuditLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuditLogs_id_seq" OWNED BY public."AuditLogs".id;


--
-- TOC entry 220 (class 1259 OID 24813)
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
-- TOC entry 221 (class 1259 OID 24821)
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
-- TOC entry 222 (class 1259 OID 24829)
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    id bigint NOT NULL,
    role_name character varying(50) NOT NULL,
    description character varying(50),
    rolelevel integer,
    "createdAt" bigint,
    "updatedAt" bigint
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24834)
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
-- TOC entry 224 (class 1259 OID 24840)
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
-- TOC entry 225 (class 1259 OID 24849)
-- Name: Subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subject" (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" bigint
);


ALTER TABLE public."Subject" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24854)
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
-- TOC entry 227 (class 1259 OID 24863)
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
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 227
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 228 (class 1259 OID 24864)
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
-- TOC entry 232 (class 1259 OID 24981)
-- Name: auth_refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_refresh_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token_hash text NOT NULL,
    expires_at bigint NOT NULL,
    revoked_at bigint,
    created_at bigint NOT NULL
);


ALTER TABLE public.auth_refresh_tokens OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24980)
-- Name: auth_refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_refresh_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 231
-- Name: auth_refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_refresh_tokens_id_seq OWNED BY public.auth_refresh_tokens.id;


--
-- TOC entry 4900 (class 2604 OID 24947)
-- Name: AuditLogs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLogs" ALTER COLUMN id SET DEFAULT nextval('public."AuditLogs_id_seq"'::regclass);


--
-- TOC entry 4899 (class 2604 OID 24870)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 4901 (class 2604 OID 24984)
-- Name: auth_refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.auth_refresh_tokens_id_seq'::regclass);


--
-- TOC entry 5091 (class 0 OID 24805)
-- Dependencies: 219
-- Data for Name: Answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Answers" (id, desciption, question_id, valid, "createdAt", "updateAt") FROM stdin;
\.


--
-- TOC entry 5102 (class 0 OID 24944)
-- Dependencies: 230
-- Data for Name: AuditLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLogs" (id, user_id, username, action, target_type, target_id, detail, "createdAt") FROM stdin;
\.


--
-- TOC entry 5092 (class 0 OID 24813)
-- Dependencies: 220
-- Data for Name: Exam; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Exam" (id, code, active, subject_id, creator_id, "createdAt") FROM stdin;
\.


--
-- TOC entry 5093 (class 0 OID 24821)
-- Dependencies: 221
-- Data for Name: Questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Questions" (id, description, "createdAt", "updatedAt", difficult, subject_id) FROM stdin;
\.


--
-- TOC entry 5094 (class 0 OID 24829)
-- Dependencies: 222
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" (id, role_name, description, rolelevel, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5095 (class 0 OID 24834)
-- Dependencies: 223
-- Data for Name: Score; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Score" (id, user_id, exam_id, "time", score) FROM stdin;
\.


--
-- TOC entry 5096 (class 0 OID 24840)
-- Dependencies: 224
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, user_id, exam_id, "time", status, answered) FROM stdin;
\.


--
-- TOC entry 5097 (class 0 OID 24849)
-- Dependencies: 225
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subject" (id, name, "createdAt") FROM stdin;
\.


--
-- TOC entry 5098 (class 0 OID 24854)
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
7	abcd		$2a$10$.2SR77mk8DrR6kmOj6SOuevDNRrAM501bJlr8octNJNKOot2olx3y	a1@gmail.com	1778174734295	1778174734295	abcd
8	abcde		$2a$10$hwPjaR7Qbbr8R/n85oz8V.FNngPqyFqiW/RNtbryce6qSbw7pOGSK	a@gmail.com	1778174868848	1778175172683	abcèasdf
9	w7989319	https://lh3.googleusercontent.com/a/ACg8ocKmD97xGHBGslimurCg_h8Me67cI2E-z-m7Y1OHx9jZEp1cquI=s96-c	$2a$10$ojRInZ7NL7ngbwj2lp/bQOEWl.EDvAVIjfoUv/0Aj28OCTrm0CtB2	w7989319@gmail.com	1778175190631	1778175190631	watawa
10	fasdfa		$2a$10$7l3m3Edz5Z7J2fazV6Uh9.WV47EIK5YzA2hMFh.3xb74LFCGUcyLS	fasdfsd@gmail.com	1778176530563	1778176530563	fasdfas
\.


--
-- TOC entry 5100 (class 0 OID 24864)
-- Dependencies: 228
-- Data for Name: Users_Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users_Roles" (id, user_id, role_id, "createdAt") FROM stdin;
\.


--
-- TOC entry 5104 (class 0 OID 24981)
-- Dependencies: 232
-- Data for Name: auth_refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, created_at) FROM stdin;
1	8	bYr9W31Mpa0X3ycLXeT6Q3vKYvlsML91R_qM4_a3Bws	1778779668853	\N	1778174868854
2	8	Cnsg8ES76QJqlpsp6Us5Z0vsmLaZwaYNYe__3ZzTGTs	1778779671767	1778175174994	1778174871767
3	8	W8F2k2JvFdjtmkgutWmB5-ShBup3QecJAfiMU_DWsew	1778779980266	1778175181523	1778175180267
4	9	pPfTW8UD1cfW3zIckhyt02uPWKiXY8nyaUYDjiaUzN4	1778779990635	1778175194136	1778175190635
5	9	KyOh1Z3E99sNzcBUed3zCF8QWp5JQATjN29m-_8ey34	1778781314310	1778176519019	1778176514312
6	10	-Rm02idZO-R_QMQ6m2aWHIZEQe-U_sItacKNjxJitNo	1778781330567	\N	1778176530567
7	10	-GhjiLgWR59_KOtoJoGVb1-Z2VLrAs_dSsj6bEvf_Ts	1778781333276	1778176559564	1778176533276
8	9	qWXJXrCa1Tzkbc0zjKqUmZcKaTTpLjzI6mwL1OHs1Ns	1778782754461	\N	1778177954464
9	10	h-glJfK5W4zTiTROpCFCIVJSrznItIs1gN2tzFuLxrM	1778782756317	1778177969380	1778177956317
10	9	8Hp9tFakQ4upd3jy-tLIRXw2zZ_VLNATzjPMnO2oXTw	1778782885938	1778178091693	1778178085938
\.


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 229
-- Name: AuditLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuditLogs_id_seq"', 1, false);


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 227
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 10, true);


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 231
-- Name: auth_refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_refresh_tokens_id_seq', 10, true);


--
-- TOC entry 4925 (class 2606 OID 24954)
-- Name: AuditLogs AuditLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLogs"
    ADD CONSTRAINT "AuditLogs_pkey" PRIMARY KEY (id);


--
-- TOC entry 4911 (class 2606 OID 24872)
-- Name: Score Score_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT "Score_pkey" PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 24874)
-- Name: Answers answer_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT answer_id PRIMARY KEY (id);


--
-- TOC entry 4930 (class 2606 OID 24993)
-- Name: auth_refresh_tokens auth_refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_tokens
    ADD CONSTRAINT auth_refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 24876)
-- Name: Exam exam_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT exam_id PRIMARY KEY (id);


--
-- TOC entry 4907 (class 2606 OID 24878)
-- Name: Questions question_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT question_id PRIMARY KEY (id);


--
-- TOC entry 4909 (class 2606 OID 24880)
-- Name: Roles role_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT role_id PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 24882)
-- Name: Session session_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT session_id PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2606 OID 24884)
-- Name: Subject subject_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT subject_id PRIMARY KEY (id);


--
-- TOC entry 4917 (class 2606 OID 24886)
-- Name: Users uk_users_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT uk_users_email UNIQUE (email);


--
-- TOC entry 4919 (class 2606 OID 24888)
-- Name: Users uk_users_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT uk_users_username UNIQUE (username);


--
-- TOC entry 4921 (class 2606 OID 24890)
-- Name: Users user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 24892)
-- Name: Users_Roles user_role_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT user_role_id PRIMARY KEY (id);


--
-- TOC entry 4926 (class 1259 OID 24957)
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_action ON public."AuditLogs" USING btree (action);


--
-- TOC entry 4927 (class 1259 OID 24956)
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_created_at ON public."AuditLogs" USING btree ("createdAt" DESC);


--
-- TOC entry 4928 (class 1259 OID 24955)
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_user_id ON public."AuditLogs" USING btree (user_id);


--
-- TOC entry 4931 (class 1259 OID 24999)
-- Name: idx_refresh_tokens_token_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_tokens_token_hash ON public.auth_refresh_tokens USING btree (token_hash);


--
-- TOC entry 4932 (class 1259 OID 25000)
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_tokens_user_id ON public.auth_refresh_tokens USING btree (user_id);


--
-- TOC entry 4943 (class 2606 OID 24994)
-- Name: auth_refresh_tokens auth_refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_tokens
    ADD CONSTRAINT auth_refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- TOC entry 4934 (class 2606 OID 24893)
-- Name: Exam creator_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT creator_id FOREIGN KEY (creator_id) REFERENCES public."Users"(id);


--
-- TOC entry 4937 (class 2606 OID 24898)
-- Name: Score exam_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT exam_id FOREIGN KEY (exam_id) REFERENCES public."Exam"(id) NOT VALID;


--
-- TOC entry 4939 (class 2606 OID 24903)
-- Name: Session exam_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT exam_id FOREIGN KEY (exam_id) REFERENCES public."Exam"(id);


--
-- TOC entry 4941 (class 2606 OID 24908)
-- Name: Users_Roles fk_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public."Roles"(id) NOT VALID;


--
-- TOC entry 4942 (class 2606 OID 24913)
-- Name: Users_Roles fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users_Roles"
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- TOC entry 4933 (class 2606 OID 24918)
-- Name: Answers question_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Answers"
    ADD CONSTRAINT question_id FOREIGN KEY (question_id) REFERENCES public."Questions"(id);


--
-- TOC entry 4935 (class 2606 OID 24923)
-- Name: Exam subject_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT subject_id FOREIGN KEY (subject_id) REFERENCES public."Subject"(id);


--
-- TOC entry 4936 (class 2606 OID 24928)
-- Name: Questions subject_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Questions"
    ADD CONSTRAINT subject_id FOREIGN KEY (subject_id) REFERENCES public."Subject"(id) NOT VALID;


--
-- TOC entry 4938 (class 2606 OID 24933)
-- Name: Score user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Score"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(id) NOT VALID;


--
-- TOC entry 4940 (class 2606 OID 24938)
-- Name: Session user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public."Users"(id);


-- Completed on 2026-05-08 01:28:36

--
-- PostgreSQL database dump complete
--

\unrestrict HqXMkEITvu580yI1xekmg3ifGmKiy3DweujyGwyLOOq1CmHYZqytosrM2vP6zhd

