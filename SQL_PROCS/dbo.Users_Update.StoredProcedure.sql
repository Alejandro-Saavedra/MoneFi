USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Users_Update]    Script Date: 6/14/2023 9:52:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Alejandro Saavedra
-- Create date: 6/13/2023
-- Description: Update User Info via user settings
-- Code Reviewer: Manuel Perez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: Initial creation.
-- =============================================
CREATE PROCEDURE [dbo].[Users_Update]			@Id int
												,@AvatarUrl varchar(255)
												,@FirstName nvarchar(100)
												,@LastName nvarchar(100)
												,@Mi nvarchar(2)
	
AS

/*

	DECLARE @Id int = 171
			,@AvatarUrl varchar(255) = 'https://cdn.britannica.com/06/150806-050-6AE99C98/Proboscis-monkey.jpg'
			,@FirstName nvarchar(100) = 'John'
			,@LastName nvarchar(100) = 'Smith'
			,@Mi nvarchar(2) = 'D'
	EXECUTE [dbo].[Users_Update] @Id
								,@AvatarUrl
								,@FirstName
								,@LastName
								,@Mi
								

	SELECT	*
	FROM	[dbo].[Users]
	WHERE	[Id] = 171

*/

BEGIN

	UPDATE	[dbo].[Users]
	SET
			[AvatarUrl] = @AvatarUrl
			,[FirstName] = @FirstName
			,[LastName] = @LastName
			,[Mi] = @Mi
			,[DateModified] = GETUTCDATE()
	WHERE	[Id] = @Id

END
GO
