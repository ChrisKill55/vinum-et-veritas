--
-- PostgreSQL database dump
--

\restrict srq36sgybFenYX4VVioAJbC0OhphWy7oiBxEuw62Zu56D0tPMUjq1WSQ3rZaNDE

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: import_runs; Type: TABLE DATA; Schema: public; Owner: weinclub_user
--

INSERT INTO public.import_runs OVERRIDING SYSTEM VALUE VALUES (1, 'excel_master', 'weinclub_master.xlsx', '1.0', 'completed_with_review', 144, 1, '2026-03-21 22:37:58.306284', '2026-03-21 22:37:58.306284');


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: weinclub_user
--

INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (2, 'Niels', 'J', 'Niels', 'analytischer Verkoster', 'analytischer Verkoster', true, '2026-03-21 22:37:00.738489', NULL, NULL, 'MEMBER');
INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (3, 'Torsten', 'Y', 'Torsten', 'El Presidente', 'El Presidente', true, '2026-03-21 22:37:00.738489', NULL, NULL, 'MEMBER');
INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (4, 'Thorsten', 'D', 'Thorsten', 'der Kritiker', 'der Kritiker', true, '2026-03-21 22:37:00.738489', NULL, NULL, 'MEMBER');
INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (5, 'Stefan', 'N', 'Stefan', 'der Genießer und Schreiberling', 'der Genießer und Schreiberling', true, '2026-03-21 22:37:00.738489', NULL, NULL, 'MEMBER');
INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (7, 'Gast', 'G', 'Gast', 'Gast', 'Gast', false, '2026-03-21 22:37:00.738489', NULL, NULL, 'MEMBER');
INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (6, 'Holger', 'H', 'Holger', 'Gastverkoster', 'Gastverkoster', false, '2026-03-21 22:37:00.738489', NULL, NULL, 'MEMBER');
INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (1, 'Christian', 'K', 'Christian', 'der Kommunikatist', 'Weinprofessor mit Glas', true, '2026-03-21 22:37:00.738489', 'news@christian-kill.de', '$2b$10$hpUKjHzpzUt4hCwEmk5mQeG4WDZ9rdti/ZDplGPv1jWLWiYm7Cdq.', 'ADMIN');
INSERT INTO public.members OVERRIDING SYSTEM VALUE VALUES (8, 'Heiko', 'H', 'Heiko', 'Weinapostel & Clubküken', 'Comic-Avatar mit Weinglas', true, '2026-03-23 22:57:44.914328', NULL, NULL, 'MEMBER');


--
-- Data for Name: tastings; Type: TABLE DATA; Schema: public; Owner: weinclub_user
--

INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (1, '2004-05-01', 1, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (2, '2004-06-12', 2, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (3, '2004-10-09', 3, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (4, '2005-02-19', 1, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (5, '2005-04-16', 1, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (6, '2005-10-22', 5, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (7, '2006-03-11', 2, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (8, '2006-04-13', 2, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (9, '2007-11-02', 2, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (10, '2008-01-26', 4, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (11, '2008-04-05', 5, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (12, '2009-03-06', 2, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (13, '2023-09-22', 1, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.tastings OVERRIDING SYSTEM VALUE VALUES (16, '2020-01-17', 4, NULL, '2026-03-28 01:08:47.745');


--
-- Data for Name: wines; Type: TABLE DATA; Schema: public; Owner: weinclub_user
--

INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'Graham Beck', 'Graham Beck', 'Cabernet Sauvignon', 1999, 'Südafrika', NULL, NULL, NULL, NULL, 'Farbe sehr positiv, Abgang vorhanden, kantenlos von durchschnittlich bis leicht überdurchschnittlich, schöner runder Alltagswein (Esswein - kein Cochwein)', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 'Land''s End', 'Land''s End', 'Cabernet Sauvignon', 2002, 'Südafrika', NULL, NULL, NULL, NULL, 'Ausgwogener Wein, der mit seiner leicht femininen Art glänzt, doch lt. Torsten einen säuerlichen Touch mit sich bringt. --> Egal: "Lecker"', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (3, 2, 1, 'Hardy''s', 'Private Bin', 'Cabernet Shiraz', 2001, 'Australien', 'Süd-Ost-Australien', 13.0, 7.50, 'angemessen', 'Bouquet geile rote Beere, ausgewogener Couchwein mit angemessenen Preis-Leistungsverhältniss. LECKER!', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (4, 2, 2, 'Jacques Chichet', 'MAS CHICHET', 'Merlot', 2003, 'Frankreich', NULL, 12.7, 4.90, NULL, 'Leichter, lockerer Sommerwein mit ruppigem Abgang, leckeres Teilchen zum Zusammensitzen, alltäglicher Wein,', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (5, 3, 1, 'Emilio Montes', 'Montes', 'Cabernet Sauvignon', 2003, 'Chile', 'Colchagua, Apolta Vineyard', 14.0, 8.50, NULL, 'Gelungener Roter mit Esprit. Starker Anfang, schwacher etwas ruppiger Abgang', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (6, 3, 2, 'Palacio de la vega', 'Palacio de la vega', 'Cabernet Sauvignon Tempranillo', 2000, 'Spanien', 'Navarra', 12.5, NULL, NULL, NULL, true, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (7, 4, 1, 'Maglieri', 'Maglieri', 'Shiraz', 2002, 'Australien', 'Nuriootpa', 14.5, 10.30, 'Angemessen', 'schöner, fruchtiger Roter mit einem beerigen Nötchen würzig. (Niels: Kirsch-Schwarze Johannisbeere)', false, true, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (8, 4, 2, 'Domaine de l''Arjolle', 'Domaine de l''Arjolle', 'Cabernet Sauvignon', 2002, 'Frankreich', NULL, 14.0, 8.50, 'Angemessen', 'lagerfähiger, z.Zt. Noch etwas ruppiger roter mit großem Potential in den nächsten Jahren. (Nonni: geiles Teil, super)', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (9, 5, 1, 'Barde-Haut', 'Le Vallon', 'Merlot', 2002, 'Frankreich', 'Saint Emilion', 13.0, 7.99, 'angemessen bis leicht überteuert', 'riecht leicht nach Alkohol; gute Farbe, geht ins violett/blau; Stefan:duftet fruchtig; Niels: schmeichelt der Zunge ist leider etwas kurz; guter Esswein, Torsten ruft Alltagswein, Küchenwein nach Niels und Christian', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (10, 5, 2, 'Rothschild', 'Los Vascos', 'Cabernet Sauvignon', 2002, 'Chile', 'Colchagua', 13.5, 13.49, 'zu teuer', 'leckerer Wein, leider zu teuer', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (11, 6, 1, 'Peter Lehmann', 'Wildcard', 'Cabernet Merlot', 2002, 'Australien', 'South Australia', 14.0, 6.99, 'etwas zu teuer', 'Stefan''s Kommentar: Es läuft Niels: lockerer unspektakulärer Rotwein mit alkohollastigem Bouquet und viel Tannin, sollte noch einige Zeit im Weinkeller verbringen.', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (12, 6, 2, 'Casa de Campo', 'Casa de Campo', 'Cabernet Carmenere', 2004, 'Chile', 'Valle Centrale', 13.5, 2.99, 'k.K.', 'Wein riecht nach dem einschenken sehr unangenehm, wird nach einiger Zeit etwas besser, hebt den Gesamteindruck jedoch nur unwesentlich an.', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (13, 7, 1, 'Lurton', 'Finca el Diamante', 'Cabernet Sauvignon', 2002, 'Argentinien', 'Mendoza', 13.5, 6.90, 'durchschnittlich', 'Christian: Ganz passabler Trinkwein Torsten: flutscht locker weg Nonni: - Niels: Leckerer wein, leider im Abgang etwas kurz, keine auffälligen schwächen oder negativen Punkte', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (14, 9, 1, 'Santa Christina Antinori', 'Santa Christina', 'Merlot', 2005, 'Italien', 'Toskana', 13.0, 6.99, NULL, 'Niels: frischer, leicht alkohollastiger Alltagswein mit kurzem Abgang Nonni: Nach 5 Stunden Luftzufuhr echt gut! Christian: Braucht Luft Torsten: Braucht voll Luft', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (15, 9, 2, 'Marques de Ballestar', 'Marques de Ballestar', NULL, 2001, 'Spanien', 'Longares', 13.5, 6.99, 'zu teuer', NULL, false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (16, 10, 1, 'Lujan de Cuyo', 'KAIKEN', 'Malbec', 2005, 'Argentinien', 'Mendoza', 14.5, 6.99, 'Angemessen', 'Gemütlicher Couchwein mit kurzem Abgang', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (17, 10, 2, 'Anselmann', 'Anselmann', 'Cabernet Franc', 2006, 'Deutschland', 'Pfalz', 13.5, 11.99, NULL, NULL, false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (18, 11, 1, 'Bodegas Fernando Castro', 'RAICES', 'Syrah', 2002, 'Spanien', 'Valdepenas', 13.0, 2.99, 'Schnapper', 'Hammer (Niels), 3-facher Preis geschätzt', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (19, 11, 2, 'Marques de Murrieta', 'YGAY 2100', 'Tempranillo', 2006, 'Spanien', 'Rioja', 14.0, 8.50, 'angemessen', 'Couchwein, PLV angemessen, Couchwein für''s Wochenende, geht gut ab (Niels), kann man guten Freunden anbieten (Chris)', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (21, 13, 2, 'Marques de Caceres', 'Marques de Caceres', 'Rioja Tempra', 2017, 'Spanien', 'Rioja', 14.0, 16.95, NULL, 'Überraschend gut, überraschend teuer.', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (23, 7, 2, 'UNBEKANNT', 'UNBEKANNT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Automatisch angelegter Platzhalter wegen Bewertungen ohne Wein-Stammsatz', false, false, true, 'missing wine row in source sheet', 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (22, 13, 3, 'Michel Mauri', 'Michel Mauri', 'Cabernet Sauvignon', 2020, 'Frankreich', 'Cedazan', 13.5, 15.50, NULL, 'Guter Wein, gutes Preis-/Leistungsverhältnis', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (20, 13, 1, 'Famiglia Zonin', 'Zonin', NULL, 2019, 'Italien', 'Gambellara', 15.5, 27.00, NULL, 'Irgendeiner muss kommen und den wegschließen (aus dem Haus) -> Liegt lange auf der Zunge. Besonderer Wein, besondere Momente.', false, false, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (24, 16, 1, 'Doppio Passo', 'Doppio Passo', 'Tempranillo, Graciano', 2019, 'Spanien', 'Rioja', 13.0, 7.99, NULL, NULL, false, false, false, NULL, NULL, '2026-03-28 01:08:47.749');
INSERT INTO public.wines OVERRIDING SYSTEM VALUE VALUES (25, 16, 2, 'Rioja Vega', 'Rioja Vega', 'Tempranilla', 2015, 'Spanien', 'Rioja', 14.0, 8.99, NULL, NULL, false, false, false, NULL, NULL, '2026-03-28 01:08:47.749');


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: weinclub_user
--

INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 8.0, 5.0, 7.0, 5.5, NULL, 6.3, '38.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 8.0, 4.0, 7.0, 5.0, NULL, 6.0, '36.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (3, 1, 3, 8.5, 5.0, 6.5, 6.0, NULL, 6.4, '38.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (4, 1, 6, 9.0, 5.0, 6.5, NULL, NULL, 6.8, '27.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (5, 1, 5, 9.5, 5.0, 7.0, 4.5, NULL, 6.3, '37.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (6, 2, 1, 7.0, 5.5, 7.0, 6.5, NULL, 6.6, '39.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (7, 2, 2, 7.0, 5.0, 7.0, 5.0, NULL, 6.0, '36.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (8, 2, 3, 8.0, 4.5, 6.5, 7.0, NULL, 6.6, '39.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (9, 2, 6, 8.0, 5.0, 7.0, NULL, NULL, 6.8, '27.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (10, 2, 5, 8.0, 6.5, 8.5, 5.5, NULL, 7.1, '42.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (11, 3, 1, 7.0, 7.5, 7.0, 6.5, NULL, 6.9, '41.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (12, 3, 2, 7.5, 8.0, 8.0, 6.5, NULL, 7.4, '44.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (13, 3, 3, 7.5, 8.0, 7.5, 6.0, NULL, 7.1, '42.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (14, 3, 6, 8.0, 6.5, 7.5, 6.0, NULL, 6.9, '41.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (15, 3, 5, 6.5, 8.0, 7.5, 5.0, NULL, 6.6, '39.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (16, 4, 1, 6.4, 4.0, 6.0, 6.0, NULL, 5.7, '34.4', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (17, 4, 2, 6.5, 5.0, 7.0, 7.0, NULL, 6.6, '39.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (18, 4, 3, 5.0, 5.0, 6.0, 6.0, NULL, 5.7, '34.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (19, 4, 6, 4.5, 5.0, 4.0, 6.0, NULL, 4.9, '29.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (20, 4, 5, 6.0, 6.5, 8.0, 7.0, NULL, 7.1, '42.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (21, 5, 1, 7.0, 8.0, 7.0, 6.0, NULL, 6.8, '41.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (22, 5, 2, 6.5, 7.5, 7.5, 6.5, NULL, 7.0, '42.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (23, 5, 3, 7.5, 7.5, 8.0, 6.0, NULL, 7.2, '43.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (24, 5, 6, 8.5, 8.0, 8.5, 7.0, NULL, 7.9, '47.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (25, 6, 1, 5.0, 6.0, 6.0, 6.0, NULL, 5.8, '35.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (26, 6, 2, 6.0, 6.0, 6.0, 5.0, NULL, 5.7, '34.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (27, 6, 3, 5.5, 6.0, 6.5, 5.5, NULL, 5.9, '35.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (28, 6, 6, 5.5, 7.0, 6.5, 6.5, NULL, 6.4, '38.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (29, 7, 1, 8.0, 7.0, 8.0, 7.5, 8.0, 7.7, '46.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (30, 7, 2, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, '48.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (31, 7, 3, 8.0, 7.5, 8.5, 7.5, 8.0, 7.9, '47.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (32, 7, 6, 9.0, 8.0, 8.5, 7.5, 8.5, 8.2, '49.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (33, 7, 5, 8.5, 7.5, 7.5, 8.0, 7.5, 7.8, '47.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (34, 8, 1, 8.5, 6.5, 7.5, 6.5, 7.5, 7.2, '43.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (35, 8, 2, 7.5, 6.5, 7.5, 6.5, 6.5, 7.0, '42.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (36, 8, 3, 7.5, 6.0, 7.5, 6.5, 6.5, 6.9, '41.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (37, 8, 6, 8.5, 7.5, 9.0, 8.0, 8.5, 8.3, '50.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (38, 8, 5, 8.5, 7.0, 9.0, 8.0, 8.5, 8.3, '49.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (39, 9, 1, 8.0, 5.5, 7.0, 6.0, 7.0, 6.6, '39.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (40, 9, 2, 7.5, 5.0, 6.0, 6.0, 6.0, 6.1, '36.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (41, 9, 3, 7.0, 5.0, 5.0, 4.5, 5.0, 5.2, '31.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (42, 9, 5, 6.5, 6.5, 7.0, 7.0, 6.5, 6.8, '41.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (43, 10, 1, 6.0, 6.5, 7.5, 6.5, 7.0, 6.8, '40.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (44, 10, 2, 6.5, 6.0, 6.5, 6.0, 6.5, 6.3, '37.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (45, 10, 3, 6.0, 6.0, 6.0, 5.5, 6.0, 5.8, '35.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (46, 10, 5, 5.5, 6.0, 7.0, 6.5, 6.5, 6.4, '38.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (47, 11, 1, 6.5, 6.0, 6.0, 5.0, 5.0, 5.8, '34.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (48, 11, 2, 6.5, 6.0, 6.0, 5.0, 5.5, 5.8, '34.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (49, 11, 3, 6.5, 6.0, 6.0, 4.5, 5.0, 5.6, '33.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (50, 11, 5, 7.0, 6.0, 7.5, 7.5, 7.5, 7.2, '43.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (51, 12, 1, 5.0, 1.0, 3.5, 3.0, 3.0, 3.2, '19.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (52, 12, 2, 6.5, 3.5, 3.5, 3.0, 3.0, 3.8, '23.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (53, 12, 3, 5.0, 0.0, 1.0, 2.0, 1.5, 1.8, '11.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (54, 12, 5, 7.0, 0.0, 4.0, 5.0, 3.0, 4.2, '25.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (55, 13, 1, 6.0, 5.5, 7.5, 4.5, 6.5, 5.9, '35.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (56, 13, 2, 6.5, 5.5, 6.5, 5.0, 6.0, 5.8, '35.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (57, 13, 3, 5.5, 5.0, 5.5, 4.0, 5.5, 4.9, '29.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (58, 13, 5, 7.0, 5.0, 6.0, 5.0, 6.0, 5.7, '34.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (59, 23, 1, 6.5, 6.0, 6.5, 6.0, NULL, 6.3, '37.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (60, 23, 2, 6.5, 6.0, 6.5, NULL, NULL, 4.3, '25.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (61, 23, 3, 7.0, NULL, NULL, NULL, NULL, 1.2, '7.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (62, 23, 5, 7.0, NULL, NULL, NULL, NULL, 1.2, '7.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (63, 14, 1, 6.0, 4.5, 6.0, 4.0, 5.5, 5.1, '30.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (64, 14, 2, 6.0, 5.5, 6.0, 4.0, 5.5, 5.3, '31.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (65, 14, 3, 5.0, 5.0, 6.0, 4.0, 5.0, 5.0, '30.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (66, 14, 5, 6.5, 6.0, 7.5, 5.0, 7.0, 6.3, '37.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (67, 14, 4, 7.0, 8.0, 5.0, 5.0, 6.0, 5.8, '35.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (68, 15, 1, 5.0, 5.5, 5.0, 4.0, NULL, 4.8, '28.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (69, 15, 2, 5.5, 5.5, 5.0, 4.5, NULL, 5.0, '30.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (70, 15, 3, 6.0, 5.0, 5.0, 4.5, NULL, 5.0, '30.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (71, 15, 5, 6.0, 6.5, 6.5, 4.0, NULL, 5.6, '33.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (72, 15, 4, 5.5, 5.0, 6.5, 5.5, NULL, 5.8, '34.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (73, 16, 1, 7.5, 7.0, 7.0, 6.0, 6.5, 6.8, '40.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (74, 16, 2, 6.0, 7.0, 6.5, 5.0, 6.5, 6.0, '36.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (75, 16, 3, 8.0, 6.5, 7.0, 6.0, 6.5, 6.8, '40.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (76, 16, 4, 7.5, 8.0, 7.0, 6.0, 7.5, 6.9, '41.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (77, 16, 5, 8.0, 7.0, 7.0, 5.0, 7.0, 6.5, '39.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (78, 17, 1, 4.5, 7.5, 7.0, 7.0, 7.0, 6.7, '40.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (79, 17, 2, 5.5, 6.0, 7.0, 6.5, 6.5, 6.4, '38.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (80, 17, 3, 3.5, 3.5, 6.5, 6.5, 6.5, 5.5, '33.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (81, 17, 4, 3.0, 7.0, 8.0, 6.5, 7.5, 6.5, '39.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (82, 17, 5, 4.0, 7.0, 8.0, 6.5, 6.5, 6.7, '40.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (83, 18, 1, 6.5, 8.5, 7.5, 7.0, 7.5, 7.3, '44.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (84, 18, 2, 6.5, 8.5, 7.5, 7.0, 7.5, 7.3, '44.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (85, 18, 3, 7.0, 8.0, 7.5, 7.0, 7.5, 7.3, '44.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (86, 18, 4, 6.0, 7.5, 7.0, 6.5, 6.5, 6.8, '40.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (87, 18, 5, 7.5, 8.5, 7.5, 7.0, 7.5, 7.5, '45.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (88, 19, 1, 8.0, 6.0, 8.0, 7.5, 8.0, 7.5, '45.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (89, 19, 2, 6.5, 6.5, 7.5, 7.0, 7.0, 7.0, '42.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (90, 19, 3, 7.5, 6.0, 7.5, 7.0, 7.5, 7.1, '42.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (91, 19, 4, 6.0, 7.5, 7.5, 7.5, 7.5, 7.3, '43.5', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (92, 19, 5, 7.0, 6.0, 8.5, 7.0, 7.5, 7.3, '44.0', false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (93, 20, 1, 7.5, 8.5, 8.5, 9.0, 9.0, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (94, 20, 2, 7.5, 8.0, 8.5, 9.0, 8.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (95, 20, 3, 8.0, 6.5, 8.5, 9.0, 9.0, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (96, 20, 4, 7.5, 8.0, 9.0, 9.0, 9.0, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (97, 20, 5, 8.0, 7.5, 9.0, 9.0, 9.0, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (98, 21, 1, 8.5, 8.0, 8.0, 6.5, 7.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (99, 21, 2, 7.5, 8.0, 7.5, 6.5, 7.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (100, 21, 3, 8.5, 8.5, 8.0, 6.5, 7.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (101, 21, 4, 7.5, 8.5, 8.0, 6.0, 8.0, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (102, 21, 5, 9.0, 8.5, 7.5, 6.5, 8.0, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (103, 22, 1, 7.5, 7.5, 8.0, 7.5, 7.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (104, 22, 2, 8.0, 8.0, 8.5, 8.5, 8.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (105, 22, 3, 7.5, 8.0, 7.5, 7.5, 7.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (106, 22, 4, 7.5, 7.5, 7.5, 7.0, 7.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (107, 22, 5, 7.5, 8.5, 9.0, 6.0, 8.5, NULL, NULL, false, NULL, 1, '2026-03-21 22:37:58.306284');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (108, 24, 1, 6.5, 6.5, 8.0, 6.0, 7.0, 6.8, NULL, false, NULL, NULL, '2026-03-28 01:55:06.358');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (109, 25, 1, 8.0, 9.0, 6.5, 7.0, 7.0, 7.6, NULL, false, NULL, NULL, '2026-03-28 01:55:06.362');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (110, 24, 8, 7.0, 6.0, 8.0, 6.5, 7.5, 6.9, NULL, false, NULL, NULL, '2026-03-28 01:59:41.621');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (111, 25, 8, 8.5, 8.5, 7.5, 6.0, 7.5, 7.6, NULL, false, NULL, NULL, '2026-03-28 01:59:41.625');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (112, 24, 2, 7.0, 6.5, 8.5, 6.0, 8.0, 7.0, NULL, false, NULL, NULL, '2026-03-28 02:01:03.304');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (113, 25, 2, 8.5, 9.0, 5.5, 6.0, 6.0, 7.3, NULL, false, NULL, NULL, '2026-03-28 02:01:03.308');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (114, 24, 4, 7.0, 6.5, 8.5, 7.0, 8.0, 7.3, NULL, false, NULL, NULL, '2026-03-28 02:03:10.412');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (115, 25, 4, 8.5, 8.0, 7.0, 6.5, 7.0, 7.5, NULL, false, NULL, NULL, '2026-03-28 02:03:10.416');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (116, 24, 3, 6.5, 7.0, 7.5, 5.5, 7.0, 6.6, NULL, false, NULL, NULL, '2026-03-28 02:05:29.208');
INSERT INTO public.ratings OVERRIDING SYSTEM VALUE VALUES (117, 25, 3, 8.0, 9.0, 7.0, 8.0, 7.5, 8.0, NULL, false, NULL, NULL, '2026-03-28 02:05:29.212');


--
-- Data for Name: review_items; Type: TABLE DATA; Schema: public; Owner: weinclub_user
--

INSERT INTO public.review_items OVERRIDING SYSTEM VALUE VALUES (1, 'wine', 23, 'missing wine row in source sheet', 'open', '2026-03-21 22:37:58.306284');


--
-- Name: import_runs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weinclub_user
--

SELECT pg_catalog.setval('public.import_runs_id_seq', 1, true);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weinclub_user
--

SELECT pg_catalog.setval('public.members_id_seq', 8, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weinclub_user
--

SELECT pg_catalog.setval('public.ratings_id_seq', 117, true);


--
-- Name: review_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weinclub_user
--

SELECT pg_catalog.setval('public.review_items_id_seq', 1, true);


--
-- Name: tastings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weinclub_user
--

SELECT pg_catalog.setval('public.tastings_id_seq', 16, true);


--
-- Name: wines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: weinclub_user
--

SELECT pg_catalog.setval('public.wines_id_seq', 25, true);


--
-- PostgreSQL database dump complete
--

\unrestrict srq36sgybFenYX4VVioAJbC0OhphWy7oiBxEuw62Zu56D0tPMUjq1WSQ3rZaNDE

