-- Update User "Sarkei" mit Klartext-Passwort für Debugging
-- NUR FÜR ENTWICKLUNG/DEBUGGING!

UPDATE users 
SET password = 'Tim.4802', 
    enabled = true
WHERE username = 'Sarkei';

-- Prüfe das Ergebnis
SELECT id, username, email, password, enabled 
FROM users 
WHERE username = 'Sarkei';
