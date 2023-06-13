USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Users_UpdateEmail]    Script Date: 6/12/2023 11:25:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Alejandro Saavedra
-- Create date: 6/9/2023
-- Description: Update a Users Email
-- Code Reviewer: Manuel Perez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: Initial creation.
-- =============================================
CREATE PROCEDURE [dbo].[Users_UpdateEmail]		@Id int
												,@Email nvarchar(255)
												,@Status int OUTPUT
												
	
AS

/*

	DECLARE @Id int = 171
			,@Email nvarchar(255) = 'AlejandrSaavedraFullStack@gmail.com'

	EXECUTE [dbo].[Users_UpdateEmail] @Id
								,@Email

	SELECT	*
	FROM	[dbo].[Users]
	WHERE	[Id] = 171

*/

BEGIN
	
	IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Email] = @Email)
	BEGIN
		UPDATE	[dbo].[Users]
		SET		[Email] = @Email
				,[DateModified] = GETUTCDATE()
		WHERE	[Id] = @Id
		SET @Status = 1;
	END
	ELSE
	BEGIN
	SET @Status = 0;
	END
END
GO
