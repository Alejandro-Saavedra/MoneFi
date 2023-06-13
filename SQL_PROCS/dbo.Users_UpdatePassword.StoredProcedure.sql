USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Users_UpdatePassword]    Script Date: 6/12/2023 11:25:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Alejandro Saavedra
-- Create date: 6/9/2023
-- Description: Update a Users Settings
-- Code Reviewer: Manuel Perez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: Initial creation.
-- =============================================
CREATE PROCEDURE [dbo].[Users_UpdatePassword]	@Id int
												,@Password nvarchar(100)
	
AS

/*

	DECLARE @Id int = 171
			,@Password nvarchar(100) = 'Hashed1!'

	EXECUTE [dbo].[Users_UpdatePassword] @Id
								,@Password

	SELECT	*
	FROM	[dbo].[Users]
	WHERE	[Id] = 171

*/

BEGIN

	UPDATE	[dbo].[Users]
	SET
			[Password] = @Password
			,[DateModified] = GETUTCDATE()
	WHERE	[Id] = @Id

END
GO
