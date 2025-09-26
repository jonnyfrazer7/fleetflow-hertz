-- Assign admin role to the current authenticated user
INSERT INTO user_roles (user_id, role) 
VALUES ('300a284f-2a75-4964-89b7-c0a349411a21', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;