TRUNCATE TABLE
  public.application,
  public.document,
  public.email_notification,
  public.email_verification_token,
  public.esign,
  public.log_entry,
  public.organization,
  public.profile,
  public.profile_to_role
RESTART IDENTITY
CASCADE;

-- profile (hr)

INSERT INTO profile (
  id,
  firstname,
  lastname,
  email,
  password,
  email_verified,
  public_key,
  org_id,
  created_at,
  updated_at
)
VALUES
  ('c3934098-bffd-4b1b-b5e6-8fa2ad261da3', 'Elvis', 'Hardalau', 'elvis.hardalau@nexus.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, timestamp '2025-01-05 09:24:10', timestamp '2025-01-07 16:32:45'),

  ('3dc8b358-fd67-4a83-82b2-679405ec8dcd', 'Dragos', 'Marogel', 'dragos.marogel@nexus.com',
   '$2b$12$jhsJDt9oDSWoWBB3Tu6Q6OErXzpnNNxCoyQVcL1eXRexSxiTWOYFS',
   TRUE, NULL, NULL, timestamp '2025-01-12 10:14:32', timestamp '2025-01-14 11:22:03'),

  ('fc7e9b36-379b-4681-9a4a-2babc01ecb7d', 'Vlad', 'Valean', 'vlad.valean@nexus.com',
   '$2b$12$zWa6YQADGTXwBArlfLYKJetb9oJCe2OeYmbJ4C5YSj7UXcAiq0uJS',
   TRUE, NULL, NULL, timestamp '2025-01-20 13:33:47', timestamp '2025-01-23 08:09:55'),

  ('ac5b3760-526a-4e5b-a667-32b21c420c9e', 'Andrea', 'Iuhasz', 'andrea.iuhasz@nexus.com',
   '$2b$12$G9N2fpCYFH9/tIIjV3jbsulR.y6Nbr08267QRcFsAQzTp4qfFRBDK',
   TRUE, NULL, NULL, timestamp '2025-01-26 15:02:18', timestamp '2025-01-28 20:15:31'),

  ('5488f550-4d88-4782-afed-f02aabd95669', 'Catalina', 'Constantin', 'catalina.constantin@nexus.com',
   '$2b$12$F59mZggzo3tlvA0H6PZuuu9AYS8VmSUqYDqX0MNWvVnplYS.QaDiG',
   TRUE, NULL, NULL, timestamp '2025-02-03 11:05:41', timestamp '2025-02-04 17:58:19'),

  ('03f8cf3a-8a3e-4ea1-bb8a-34966d4e0998', 'Ethan', 'Brown', 'ethan.brown@nexus.com',
   '$2b$12$woJhUSyB3ps/pPLwf.dcIOzfqQ.ML.1fGO2Qky0QSzdDCFj68u6jy',
   TRUE, NULL, NULL, timestamp '2025-02-08 09:41:22', timestamp '2025-02-10 10:03:44'),

  ('d0018ce0-c7b6-4c94-b84f-919afe90609b', 'Olivia', 'Martinez', 'olivia.martinez@nexus.com',
   '$2b$12$HeuUNHmeCFTVszTbZF..G.lbD51pFX/B4w4R39JuA4zi9ICiN57o2',
   TRUE, NULL, NULL, timestamp '2025-02-15 14:12:03', timestamp '2025-02-18 12:22:09'),

  ('31d8048a-5e21-434f-b08c-6deecbb2b8d6', 'Jacob', 'Kim', 'jacob.kim@nexus.com',
   '$2b$12$qzFt615AzrWcSkmEqqFbP./RHBUnZPtDSr2xTbeJBT02Aq.KOARry',
   TRUE, NULL, NULL, timestamp '2025-02-22 07:23:14', timestamp '2025-02-24 19:33:50'),

  ('8801abc5-527a-4306-9bf7-cd6fa1712664', 'Emma', 'Lopez', 'emma.lopez@nexus.com',
   '$2b$12$SA5lcEPUFm6EJdCfulM5meCvwYHSFdn4bWVkvRtxIFTwwZpweTy2m',
   TRUE, NULL, NULL, timestamp '2025-03-01 08:41:10', timestamp '2025-03-03 09:21:42'),

  ('d856f565-a74e-4d50-8f2b-029c685ee937', 'Lucas', 'Davis', 'lucas.davis@nexus.com',
   '$2b$12$sPXHGWy/lvyt.xpJL3/Y0uesNkHoUTbUi8zbkoQHHO.zAxUo6mIYq',
   TRUE, NULL, NULL, timestamp '2025-03-05 11:59:33', timestamp '2025-03-08 14:10:17'),

  ('0a8ff87c-d94b-4172-a68f-3647c8185a9f', 'Mila', 'Wilson', 'mila.wilson@nexus.com',
   '$2b$12$U5AiENpee2SJJFEFY0qOBezBU2Qi6d2wKvwYjoOTKx2ElfPZ6ZB1a',
   TRUE, NULL, NULL, timestamp '2025-03-12 16:18:27', timestamp '2025-03-15 10:04:58'),

  ('7419e24c-d9ff-41e1-b85a-e14102023b88', 'James', 'Anderson', 'james.anderson@nexus.com',
   '$2b$12$IB4SLNRM1IAubCg/W3SoOeHC5kd1Awx4Mzvpi8A82tkMy4lqbHuCi',
   TRUE, NULL, NULL, timestamp '2025-03-20 12:47:08', timestamp '2025-03-21 19:33:21'),

  ('3d480fac-703c-4959-afe9-b474ff4f8434', 'Ella', 'Rodriguez', 'ella.rodriguez@nexus.com',
   '$2b$12$Io2gdfYyhjZBZVbKZkh0eu.BKekjtfhDY8ve7FSxF8qvMg9WOjF2q',
   TRUE, NULL, NULL, timestamp '2025-04-01 09:14:50', timestamp '2025-04-02 11:45:15'),

  ('7c50593d-f685-49ec-ac6e-df2f0d77e389', 'Henry', 'Lee', 'henry.lee@nexus.com',
   '$2b$12$muq3w.tRt0Q1Zj/elIfd4eyS1yWLGmkx2a4Gtx1eKOXCPaklrERWq',
   TRUE, NULL, NULL, timestamp '2025-04-10 18:32:09', timestamp '2025-04-12 20:05:42'),

  ('3ce37675-a8a5-4a1d-b595-bc3befa642a4', 'Isabella', 'Thomas', 'isabella.thomas@nexus.com',
   '$2b$12$mQ2I1GxeAA9W.mUKDR/ua.xNB59tya9YyM.reuqZ4wPmMlKMEzPKS',
   TRUE, NULL, NULL, timestamp '2025-04-18 08:15:22', timestamp '2025-04-20 13:58:49'),

  ('7aec26bd-9530-4fb1-9e34-63c2279f5e82', 'William', 'White', 'william.white@nexus.com',
   '$2b$12$vGeOD0MY6GZnjQ9cE7/bKeo.lgTuTAkqWeSX3y9lJNNWE4q.GSyzm',
   TRUE, NULL, NULL, timestamp '2025-05-02 11:22:05', timestamp '2025-05-04 16:03:55'),

  ('90e46e2f-6a33-4252-a16e-bce274dca4a4', 'Charlotte', 'Clark', 'charlotte.clark@nexus.com',
   '$2b$12$biPHH2xtZT0Se7VEeLhnS.wALUASAar9k4.akLnIH4xMZgLZM3OgC',
   TRUE, NULL, NULL, timestamp '2025-05-10 13:35:19', timestamp '2025-05-11 18:25:40'),

  ('2969a8a0-b99e-4ae9-a107-cbedc831bd0e', 'Benjamin', 'Harris', 'benjamin.harris@nexus.com',
   '$2b$12$aWa3pupoW4SXzZdzMMIxU.SvTCl1TClCwdKkkNJHymXqiKAtcKK6G',
   TRUE, NULL, NULL, timestamp '2025-05-20 09:08:16', timestamp '2025-05-23 07:43:29'),

  ('e833b86b-88a2-4984-8a26-8a804394382d', 'Amelia', 'Walker', 'amelia.walker@nexus.com',
   '$2b$12$tmwiS0beLVFjbq9PD9YnuuS1olpLDspWX6ayssiw2EXjcRp9unA4G',
   TRUE, NULL, NULL, timestamp '2025-06-01 10:44:33', timestamp '2025-06-03 17:59:40'),

  ('22183d0a-172c-4396-b313-d6fb39359d4e', 'Elijah', 'Young', 'elijah.young@nexus.com',
   '$2b$12$Dk.1qOh08GYhjqbC8kPcDOXRYWfOXOOiCwUdUWWEPRWJnwo0rrJ7S',
   TRUE, NULL, NULL, timestamp '2025-06-15 07:55:28', timestamp '2025-06-16 08:40:11'),

  ('4b7cd57c-e92c-445c-b01f-ca0f0edaece3', 'Daniel', 'Miller', 'daniel.miller@nexus.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, timestamp '2025-06-20 09:10:11', timestamp '2025-06-21 14:22:30'),

  ('64755a6e-2a4d-4c13-8425-cea28bb34a28', 'Grace', 'Taylor', 'grace.taylor@nexus.com',
   '$2b$12$jhsJDt9oDSWoWBB3Tu6Q6OErXzpnNNxCoyQVcL1eXRexSxiTWOYFS',
   TRUE, NULL, NULL, timestamp '2025-06-22 10:45:00', timestamp '2025-06-23 08:12:44'),

  ('85c89508-b4d2-41b1-8652-2301aa52ce8d', 'Owen', 'Moore', 'owen.moore@nexus.com',
   '$2b$12$zWa6YQADGTXwBArlfLYKJetb9oJCe2OeYmbJ4C5YSj7UXcAiq0uJS',
   TRUE, NULL, NULL, timestamp '2025-06-24 11:03:19', timestamp '2025-06-26 16:41:07'),

  ('1359b283-3df0-4abc-be03-0d1475916719', 'Zoe', 'Andrews', 'zoe.andrews@nexus.com',
   '$2b$12$G9N2fpCYFH9/tIIjV3jbsulR.y6Nbr08267QRcFsAQzTp4qfFRBDK',
   TRUE, NULL, NULL, timestamp '2025-06-27 09:30:54', timestamp '2025-06-28 12:18:09'),

  ('3b66db24-4ee1-485a-890a-4dc83bbc9074', 'Caleb', 'Scott', 'caleb.scott@nexus.com',
   '$2b$12$F59mZggzo3tlvA0H6PZuuu9AYS8VmSUqYDqX0MNWvVnplYS.QaDiG',
   TRUE, NULL, NULL, timestamp '2025-06-29 15:44:21', timestamp '2025-06-30 18:55:10'),

  ('be4389fe-857e-4a84-996b-c2c53bf117b7', 'Hannah', 'Evans', 'hannah.evans@nexus.com',
   '$2b$12$woJhUSyB3ps/pPLwf.dcIOzfqQ.ML.1fGO2Qky0QSzdDCFj68u6jy',
   TRUE, NULL, NULL, timestamp '2025-07-01 08:17:42', timestamp '2025-07-02 09:09:36'),

  ('63f88c22-bffc-416a-b8ff-cbf5f2796cbe', 'Leo', 'Turner', 'leo.turner@nexus.com',
   '$2b$12$HeuUNHmeCFTVszTbZF..G.lbD51pFX/B4w4R39JuA4zi9ICiN57o2',
   TRUE, NULL, NULL, timestamp '2025-07-03 13:26:55', timestamp '2025-07-05 15:40:02'),

  ('45d4c609-84fa-452c-807a-f06bf58bec34', 'Nina', 'Parker', 'nina.parker@nexus.com',
   '$2b$12$qzFt615AzrWcSkmEqqFbP./RHBUnZPtDSr2xTbeJBT02Aq.KOARry',
   TRUE, NULL, NULL, timestamp '2025-07-06 10:58:33', timestamp '2025-07-07 14:11:08'),

  ('46a33734-5cb1-4eba-878b-ecbbdd181222', 'Victor', 'Collins', 'victor.collins@nexus.com',
   '$2b$12$SA5lcEPUFm6EJdCfulM5meCvwYHSFdn4bWVkvRtxIFTwwZpweTy2m',
   TRUE, NULL, NULL, timestamp '2025-07-08 09:07:27', timestamp '2025-07-09 17:29:51'),

  ('90a795fa-23f8-4ab6-8634-38343b6db504', 'Ivy', 'Stewart', 'ivy.stewart@nexus.com',
   '$2b$12$sPXHGWy/lvyt.xpJL3/Y0uesNkHoUTbUi8zbkoQHHO.zAxUo6mIYq',
   TRUE, NULL, NULL, timestamp '2025-07-10 11:36:49', timestamp '2025-07-12 16:03:22'),

  ('e1cb191f-4546-4310-a88b-37f409f4387f', 'Aaron', 'Reed', 'aaron.reed@nexus.com',
   '$2b$12$U5AiENpee2SJJFEFY0qOBezBU2Qi6d2wKvwYjoOTKx2ElfPZ6ZB1a',
   TRUE, NULL, NULL, timestamp '2025-07-13 08:54:18', timestamp '2025-07-14 12:44:07'),

  ('c36c5910-6e70-4923-8a96-4e2bf77cf2ee', 'Lily', 'Cook', 'lily.cook@nexus.com',
   '$2b$12$IB4SLNRM1IAubCg/W3SoOeHC5kd1Awx4Mzvpi8A82tkMy4lqbHuCi',
   TRUE, NULL, NULL, timestamp '2025-07-15 14:22:59', timestamp '2025-07-17 09:10:41'),

  ('693ed663-7aea-4337-83bb-e01518997120', 'Marcus', 'Bell', 'marcus.bell@nexus.com',
   '$2b$12$Io2gdfYyhjZBZVbKZkh0eu.BKekjtfhDY8ve7FSxF8qvMg9WOjF2q',
   TRUE, NULL, NULL, timestamp '2025-07-18 10:06:05', timestamp '2025-07-19 18:30:26'),

  ('6cdb9757-d3c1-4351-b0a4-a9f0c980b532', 'Paige', 'Murphy', 'paige.murphy@nexus.com',
   '$2b$12$muq3w.tRt0Q1Zj/elIfd4eyS1yWLGmkx2a4Gtx1eKOXCPaklrERWq',
   TRUE, NULL, NULL, timestamp '2025-07-20 09:48:12', timestamp '2025-07-21 13:55:40'),

  ('6e852e45-faaf-4993-9677-87bfe894f178', 'Julian', 'Rogers', 'julian.rogers@nexus.com',
   '$2b$12$mQ2I1GxeAA9W.mUKDR/ua.xNB59tya9YyM.reuqZ4wPmMlKMEzPKS',
   TRUE, NULL, NULL, timestamp '2025-07-22 11:31:34', timestamp '2025-07-24 16:22:19'),

  ('cb7c83e8-6774-48eb-b0f9-ac6ccc316f59', 'Sofia', 'Price', 'sofia.price@nexus.com',
   '$2b$12$vGeOD0MY6GZnjQ9cE7/bKeo.lgTuTAkqWeSX3y9lJNNWE4q.GSyzm',
   TRUE, NULL, NULL, timestamp '2025-07-25 08:20:55', timestamp '2025-07-26 14:07:03'),

  ('a04be26b-313f-44b5-bc82-faf3aa138b95', 'Connor', 'Hughes', 'connor.hughes@nexus.com',
   '$2b$12$biPHH2xtZT0Se7VEeLhnS.wALUASAar9k4.akLnIH4xMZgLZM3OgC',
   TRUE, NULL, NULL, timestamp '2025-07-27 09:39:46', timestamp '2025-07-28 17:18:58'),

  ('af101ff5-3d1a-4964-b830-04113f203cd9', 'Riley', 'Foster', 'riley.foster@nexus.com',
   '$2b$12$aWa3pupoW4SXzZdzMMIxU.SvTCl1TClCwdKkkNJHymXqiKAtcKK6G',
   TRUE, NULL, NULL, timestamp '2025-07-29 10:15:07', timestamp '2025-07-30 12:46:29'),

  ('50b729eb-0dcf-462c-b000-5a8fe5b1a964', 'Elena', 'Brooks', 'elena.brooks@nexus.com',
   '$2b$12$tmwiS0beLVFjbq9PD9YnuuS1olpLDspWX6ayssiw2EXjcRp9unA4G',
   TRUE, NULL, NULL, timestamp '2025-08-01 08:33:21', timestamp '2025-08-02 09:59:44'),

  ('78aa455a-0d99-4cab-9d34-3521dff39b35', 'Theo', 'Sanders', 'theo.sanders@nexus.com',
   '$2b$12$Dk.1qOh08GYhjqbC8kPcDOXRYWfOXOOiCwUdUWWEPRWJnwo0rrJ7S',
   TRUE, NULL, NULL, timestamp '2025-08-03 11:41:55', timestamp '2025-08-04 16:08:10'),

  ('13607c28-d777-47e7-a2ff-a6ff9d3219ca', 'Jade', 'Powell', 'jade.powell@nexus.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, timestamp '2025-08-05 09:27:36', timestamp '2025-08-06 13:12:49'),

  ('1ce24471-ae64-4135-8f8e-bb8ed768623a', 'Ryan', 'Long', 'ryan.long@nexus.com',
   '$2b$12$jhsJDt9oDSWoWBB3Tu6Q6OErXzpnNNxCoyQVcL1eXRexSxiTWOYFS',
   TRUE, NULL, NULL, timestamp '2025-08-07 10:58:14', timestamp '2025-08-08 15:44:02'),

  ('c2130070-2dbe-4c79-a032-c2b7870e5393', 'Megan', 'Perry', 'megan.perry@nexus.com',
   '$2b$12$zWa6YQADGTXwBArlfLYKJetb9oJCe2OeYmbJ4C5YSj7UXcAiq0uJS',
   TRUE, NULL, NULL, timestamp '2025-08-09 08:11:25', timestamp '2025-08-10 09:35:18'),

  ('fc03fb57-eed2-42e9-b62b-25f38d4c30ff', 'Austin', 'Ward', 'austin.ward@nexus.com',
   '$2b$12$G9N2fpCYFH9/tIIjV3jbsulR.y6Nbr08267QRcFsAQzTp4qfFRBDK',
   TRUE, NULL, NULL, timestamp '2025-08-11 12:44:51', timestamp '2025-08-12 17:06:30'),

  ('d7711566-8911-4b00-b14b-90c439ac22e3', 'Claire', 'Bennett', 'claire.bennett@nexus.com',
   '$2b$12$F59mZggzo3tlvA0H6PZuuu9AYS8VmSUqYDqX0MNWvVnplYS.QaDiG',
   TRUE, NULL, NULL, timestamp '2025-08-13 09:09:09', timestamp '2025-08-14 11:55:27'),

  ('9e733f54-17cf-4df1-acc1-3a39cdf15b11', 'Dylan', 'Rivera', 'dylan.rivera@nexus.com',
   '$2b$12$woJhUSyB3ps/pPLwf.dcIOzfqQ.ML.1fGO2Qky0QSzdDCFj68u6jy',
   TRUE, NULL, NULL, timestamp '2025-08-15 10:31:40', timestamp '2025-08-16 14:20:05'),

  ('6c05683e-1ee7-4d3f-8d59-6418adbbda4d', 'Natalie', 'Cooper', 'natalie.cooper@nexus.com',
   '$2b$12$HeuUNHmeCFTVszTbZF..G.lbD51pFX/B4w4R39JuA4zi9ICiN57o2',
   TRUE, NULL, NULL, timestamp '2025-08-17 08:52:16', timestamp '2025-08-18 12:03:49'),

  ('fcaa4935-b65c-41ff-9a7b-dc3d2f29fd49', 'Evan', 'Flores', 'evan.flores@nexus.com',
   '$2b$12$qzFt615AzrWcSkmEqqFbP./RHBUnZPtDSr2xTbeJBT02Aq.KOARry',
   TRUE, NULL, NULL, timestamp '2025-08-19 11:18:33', timestamp '2025-08-20 16:47:58'),

  ('e9b42725-3f54-434e-9c89-d6cede694598', 'Priya', 'Shah', 'priya.shah@nexus.com',
   '$2b$12$SA5lcEPUFm6EJdCfulM5meCvwYHSFdn4bWVkvRtxIFTwwZpweTy2m',
   TRUE, NULL, NULL, timestamp '2025-08-21 09:40:12', timestamp '2025-08-22 13:29:44'),

  ('e79e0b73-9fcc-4dbf-89ef-4b71479dee42', 'Tom', 'Keller', 'tom.keller@nexus.com',
   '$2b$12$sPXHGWy/lvyt.xpJL3/Y0uesNkHoUTbUi8zbkoQHHO.zAxUo6mIYq',
   TRUE, NULL, NULL, timestamp '2025-08-23 10:56:07', timestamp '2025-08-24 15:11:30');

INSERT INTO profile_to_role (profile_id, role_id)
SELECT id, 2
FROM profile;

-- profile (admin)

WITH admin_profile AS (
  INSERT INTO profile (
    id,
    firstname,
    lastname,
    email,
    password,
    email_verified,
    public_key,
    org_id,
    created_at,
    updated_at
  )
  VALUES (
    'cdf5f593-d6dc-4adc-ba08-6e7ee4c92c72',
    'Admin',
    'admin',
    'admin@nexus.com',
    '$2b$12$/qI8sHbTg83Z25SRX55R1.5/gqH0Z6AYW29EGscMLjBkwwNNOTRTC',
    TRUE,
    NULL,
    NULL,
    timestamp '2024-12-05 06:34:50',
    timestamp '2024-12-07 12:32:55'
  )
  RETURNING id
)
INSERT INTO profile_to_role (profile_id, role_id)
SELECT id, 3
FROM admin_profile;

-- organization

INSERT INTO organization (name, owner_id, created_at, updated_at)
VALUES
  ('Acme Solutions', 'c3934098-bffd-4b1b-b5e6-8fa2ad261da3', timestamp '2025-01-03 08:42:11', timestamp '2025-01-05 14:21:09'),
  ('Blue Horizon Ltd', '3dc8b358-fd67-4a83-82b2-679405ec8dcd', timestamp '2025-01-06 11:18:54', timestamp '2025-01-07 09:44:30'),
  ('NextGen Systems', 'fc7e9b36-379b-4681-9a4a-2babc01ecb7d', timestamp '2025-01-08 15:02:33', timestamp '2025-01-10 10:12:47'),
  ('Vertex Consulting', 'ac5b3760-526a-4e5b-a667-32b21c420c9e', timestamp '2025-01-11 09:27:18', timestamp '2025-01-12 16:48:55'),
  ('Nimbus Corp', '5488f550-4d88-4782-afed-f02aabd95669', timestamp '2025-01-13 14:36:02', timestamp '2025-01-15 08:19:41'),
  
  ('Ironclad Group', '03f8cf3a-8a3e-4ea1-bb8a-34966d4e0998', timestamp '2025-01-16 10:05:29', timestamp '2025-01-18 12:52:10'),
  ('Atlas Industries', 'd0018ce0-c7b6-4c94-b84f-919afe90609b', timestamp '2025-01-19 07:58:44', timestamp '2025-01-20 15:37:06'),
  ('Nova Digital', '31d8048a-5e21-434f-b08c-6deecbb2b8d6', timestamp '2025-01-21 13:46:21', timestamp '2025-01-23 09:11:59'),
  ('Evergreen Labs', '8801abc5-527a-4306-9bf7-cd6fa1712664', timestamp '2025-01-24 08:22:10', timestamp '2025-01-25 17:03:34'),
  ('Pulse Analytics', 'd856f565-a74e-4d50-8f2b-029c685ee937', timestamp '2025-01-26 16:09:55', timestamp '2025-01-28 11:40:12'),

  ('Silverline Tech', '0a8ff87c-d94b-4172-a68f-3647c8185a9f', timestamp '2025-01-29 09:14:08', timestamp '2025-01-30 18:27:46'),
  ('Brightpath LLC', '7419e24c-d9ff-41e1-b85a-e14102023b88', timestamp '2025-02-01 12:33:19', timestamp '2025-02-03 10:58:02'),
  ('Cloudforge', '3d480fac-703c-4959-afe9-b474ff4f8434', timestamp '2025-02-04 08:51:44', timestamp '2025-02-05 14:22:17'),
  ('Stratos Works', '7c50593d-f685-49ec-ac6e-df2f0d77e389', timestamp '2025-02-06 15:47:09', timestamp '2025-02-08 09:36:55'),
  ('Orion Ventures', '3ce37675-a8a5-4a1d-b595-bc3befa642a4', timestamp '2025-02-09 11:05:26', timestamp '2025-02-10 16:41:08'),

  ('Lighthouse Group', '7aec26bd-9530-4fb1-9e34-63c2279f5e82', timestamp '2025-02-11 09:59:13', timestamp '2025-02-13 13:18:45'),
  ('Redwood Systems', '90e46e2f-6a33-4252-a16e-bce274dca4a4', timestamp '2025-02-14 14:24:38', timestamp '2025-02-15 10:07:59'),
  ('Summit Solutions', '2969a8a0-b99e-4ae9-a107-cbedc831bd0e', timestamp '2025-02-16 08:16:52', timestamp '2025-02-18 12:39:10'),
  ('Apex Dynamics', 'e833b86b-88a2-4984-8a26-8a804394382d', timestamp '2025-02-19 15:32:07', timestamp '2025-02-20 09:48:33'),
  ('Beacon Software', '22183d0a-172c-4396-b313-d6fb39359d4e', timestamp '2025-02-21 10:41:18', timestamp '2025-02-23 14:55:06'),

  ('Northstar IT', '4b7cd57c-e92c-445c-b01f-ca0f0edaece3', timestamp '2025-02-24 09:03:47', timestamp '2025-02-25 16:20:12'),
  ('Helix Labs', '64755a6e-2a4d-4c13-8425-cea28bb34a28', timestamp '2025-02-26 13:28:55', timestamp '2025-02-27 11:09:41'),
  ('Quantum Edge', '85c89508-b4d2-41b1-8652-2301aa52ce8d', timestamp '2025-02-28 08:57:33', timestamp '2025-03-01 15:44:09'),
  ('Fusion Partners', '1359b283-3df0-4abc-be03-0d1475916719', timestamp '2025-03-02 16:11:26', timestamp '2025-03-04 10:02:18'),
  ('Innova Group', '3b66db24-4ee1-485a-890a-4dc83bbc9074', timestamp '2025-03-05 09:36:41', timestamp '2025-03-06 17:19:58'),

  ('Corewave', 'be4389fe-857e-4a84-996b-c2c53bf117b7', timestamp '2025-03-07 14:08:05', timestamp '2025-03-08 11:55:22'),
  ('Vanguard Tech', '63f88c22-bffc-416a-b8ff-cbf5f2796cbe', timestamp '2025-03-09 08:49:17', timestamp '2025-03-11 13:34:46'),
  ('Zenith Labs', '45d4c609-84fa-452c-807a-f06bf58bec34', timestamp '2025-03-12 15:21:39', timestamp '2025-03-13 09:10:27'),
  ('Polar Innovations', '46a33734-5cb1-4eba-878b-ecbbdd181222', timestamp '2025-03-14 10:58:44', timestamp '2025-03-16 16:07:12'),
  ('Harbor Systems', '90a795fa-23f8-4ab6-8634-38343b6db504', timestamp '2025-03-17 09:42:31', timestamp '2025-03-18 14:56:08'),

  ('Skyline Networks', 'e1cb191f-4546-4310-a88b-37f409f4387f', timestamp '2025-03-19 11:15:49', timestamp '2025-03-20 17:09:55'),
  ('Elevate Consulting', 'c36c5910-6e70-4923-8a96-4e2bf77cf2ee', timestamp '2025-03-21 08:27:04', timestamp '2025-03-22 12:33:19'),
  ('BluePeak Ventures', '693ed663-7aea-4337-83bb-e01518997120', timestamp '2025-03-23 15:39:28', timestamp '2025-03-24 10:18:44'),
  ('IronPeak Solutions', '6cdb9757-d3c1-4351-b0a4-a9f0c980b532', timestamp '2025-03-25 09:51:06', timestamp '2025-03-26 14:07:52'),
  ('Brightline Software', '6e852e45-faaf-4993-9677-87bfe894f178', timestamp '2025-03-27 13:22:58', timestamp '2025-03-28 16:41:33'),

  ('Momentum Labs', 'cb7c83e8-6774-48eb-b0f9-ac6ccc316f59', timestamp '2025-03-29 10:06:14', timestamp '2025-03-30 15:54:21'),
  ('Clearview Analytics', 'a04be26b-313f-44b5-bc82-faf3aa138b95', timestamp '2025-03-31 08:44:57', timestamp '2025-04-01 12:29:38'),
  ('Summit Ridge Group', 'af101ff5-3d1a-4964-b830-04113f203cd9', timestamp '2025-04-02 14:19:46', timestamp '2025-04-03 09:08:17'),
  ('Aurora Systems', '50b729eb-0dcf-462c-b000-5a8fe5b1a964', timestamp '2025-04-04 11:37:52', timestamp '2025-04-05 16:21:04'),
  ('Pathfinder Tech', '78aa455a-0d99-4cab-9d34-3521dff39b35', timestamp '2025-04-06 09:55:33', timestamp '2025-04-07 14:46:10'),

  ('Cascade Solutions', '13607c28-d777-47e7-a2ff-a6ff9d3219ca', timestamp '2025-04-08 10:12:45', timestamp '2025-04-09 15:34:18'),
  ('Ironwood Consulting', '1ce24471-ae64-4135-8f8e-bb8ed768623a', timestamp '2025-04-10 09:28:07', timestamp '2025-04-11 14:06:52'),
  ('Bluewave Technologies', 'c2130070-2dbe-4c79-a032-c2b7870e5393', timestamp '2025-04-12 13:41:29', timestamp '2025-04-13 10:22:44'),
  ('SummitCore Systems', 'fc03fb57-eed2-42e9-b62b-25f38d4c30ff', timestamp '2025-04-14 08:55:16', timestamp '2025-04-15 16:18:09'),
  ('Vertex One Group', 'd7711566-8911-4b00-b14b-90c439ac22e3', timestamp '2025-04-16 11:37:58', timestamp '2025-04-17 09:49:31'),
  
  ('Everpath Digital', '9e733f54-17cf-4df1-acc1-3a39cdf15b11', timestamp '2025-04-18 14:09:22', timestamp '2025-04-19 12:26:40'),
  ('Northbridge Labs', '6c05683e-1ee7-4d3f-8d59-6418adbbda4d', timestamp '2025-04-20 10:44:05', timestamp '2025-04-21 15:57:18'),
  ('Skyward Analytics', 'fcaa4935-b65c-41ff-9a7b-dc3d2f29fd49', timestamp '2025-04-22 09:16:33', timestamp '2025-04-23 13:42:56'),
  ('PulseCore Innovations', 'e9b42725-3f54-434e-9c89-d6cede694598', timestamp '2025-04-24 15:28:49', timestamp '2025-04-25 11:05:27'),
  ('Harborline Software', 'e79e0b73-9fcc-4dbf-89ef-4b71479dee42', timestamp '2025-04-26 08:39:14', timestamp '2025-04-27 14:51:08');

-- update hr to set org_id

WITH hr_ordered AS (
    SELECT
        p.id AS profile_id,
        ROW_NUMBER() OVER (ORDER BY p.created_at) AS rn
    FROM profile p
    JOIN profile_to_role ptr ON ptr.profile_id = p.id
    WHERE ptr.role_id = 2
),
org_ordered AS (
    SELECT
        o.id AS org_id,
        ROW_NUMBER() OVER (ORDER BY o.created_at) AS rn
    FROM organization o
)
UPDATE profile p
SET org_id = o.org_id
FROM hr_ordered h
JOIN org_ordered o ON o.rn = h.rn
WHERE p.id = h.profile_id;

-- profile (user)

INSERT INTO profile (
  id,
  firstname,
  lastname,
  email,
  password,
  email_verified,
  public_key,
  org_id,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),

  firstnames[(i - 1) % array_length(firstnames, 1) + 1],
  lastnames[(i - 1) % array_length(lastnames, 1) + 1],

  lower(
    firstnames[(i - 1) % array_length(firstnames, 1) + 1]
    || '.'
    || lastnames[(i - 1) % array_length(lastnames, 1) + 1]
    || i
    || '@example.com'
  ),

  '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
  TRUE,
  NULL,
  NULL,
  now(),
  now()
FROM generate_series(1, 400) AS s(i)
CROSS JOIN (
  SELECT
    ARRAY[
      'John','Jane','Alex','Maria','Luca','Elena','Andrei','Ioana',
      'Mihai','Ana','Victor','Sofia','Daniel','Irina','Paul','Laura',
      'Radu','Bianca','Cristian','Daria'
    ] AS firstnames,
    ARRAY[
      'Popescu','Ionescu','Smith','Brown','Taylor','Miller','Wilson',
      'Anderson','Clark','Lewis','Walker','Hall','Young','Allen',
      'King','Wright','Scott','Green','Baker','Adams'
    ] AS lastnames
) n;

INSERT INTO profile_to_role (profile_id, role_id)
SELECT id, 1
FROM profile
WHERE email LIKE '%@example.com';

WITH users_ordered AS (
    SELECT
        p.id AS profile_id,
        ROW_NUMBER() OVER (ORDER BY p.created_at) AS rn
    FROM profile p
    JOIN profile_to_role ptr ON ptr.profile_id = p.id
    WHERE ptr.role_id = 1
      AND p.email LIKE '%@example.com'
),
orgs_ordered AS (
    SELECT
        o.id AS org_id,
        ROW_NUMBER() OVER (ORDER BY o.id) AS rn
    FROM organization o
    ORDER BY o.id
    LIMIT 50
)
UPDATE profile p
SET org_id = o.org_id
FROM users_ordered u
JOIN orgs_ordered o
  ON o.rn = ((u.rn - 1) % 50) + 1
WHERE p.id = u.profile_id;

INSERT INTO profile (
  id,
  firstname,
  lastname,
  email,
  password,
  email_verified,
  public_key,
  org_id,
  created_at,
  updated_at
)
VALUES
  (gen_random_uuid(), 'Elvis',   'Hardalau',  'elvis.hardalau@example.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Dragos',   'Marogel',  'dragos.marogel@example.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Vlad',   'Valean',  'vlad.valean@example.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Andrea',  'Iuhasz',  'andrea.iuhasz@example.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, now(), now()),

  (gen_random_uuid(), 'Catalina',   'Constantin',  'catalina.constantin@example.com',
   '$2b$12$1DRd53EUT.X/i4xuVW5MduV258FqazREoWwv3.P2FrQjs6eqeUpl2',
   TRUE, NULL, NULL, now(), now());

INSERT INTO profile_to_role (profile_id, role_id)
SELECT p.id, 1
FROM profile p
WHERE p.email IN (
  'elvis.hardalau@example.com',
  'dragos.marogel@example.com',
  'vlad.valean@example.com',
  'andrea.iuhasz@example.com',
  'catalina.constantin@example.com'
)
ON CONFLICT DO NOTHING;