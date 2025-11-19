CREATE PROCEDURE st_Movto_Usuario @USU_Perfil       Varchar(30)
                                 ,@USU_Email        Varchar(100)
                                 ,@USU_Senha        Varchar(100)
                                 ,@USU_DataCadastro Datetime2
                                 ,@USU_Status       Bit(1)       = 1
                                 ,@Acao             Char(1)      = 'I' --// I - Insert | U - Update | D - Delete
                                 ,@UsuarioId        Integer      = NULL OUTPUT
                                 ,@Return_Code      Smallint     = 0    OUTPUT
                                 ,@ErrorMsg         Varchar(255) = ''   OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

  BEGIN TRY
    SELECT @Return_Code = 0
          ,@ErrorMsg    = '';

    IF (ISNULL(@USU_Perfil, '') = '') SET @ErrorMsg += Char(13) + 'USU_Perfil';
    IF (ISNULL(@USU_Email, '')  = '') SET @ErrorMsg += Char(13) + 'USU_Email';
    IF (ISNULL(@USU_Senha, '')  = '') SET @ErrorMsg += Char(13) + 'USU_Senha';
    IF (ISNULL(@USU_Status), '' = '') SET @ErrorMsg += Char(13) + 'USU_Status';
    IF (ISNULL(@Acao), ''       = '') SET @ErrorMsg += Char(13) + 'Acao';
    IF (ISNULL(@Acao, 'I') 
      IN ('U', 'D') 
      AND ISNULL(@UsuarioId, 0) = 0)  SET @ErrorMsg += Char(13) + 'UsuarioId (obrigatório para Update e Delete)';

    IF (ISNULL(@ErrorMsg, '') <> '')
    BEGIN
      SELECT @Return_Code = 2
            ,@ErrorMsg    = 'st_Movto_Usuario: Campos obrigatórios não preenchidos: ' + @ErrorMsg;
      IF (@@TRANCOUNT > 0) ROLLBACK TRANSACTION;
      RAISERROR(@ErrorMsg, 18, 1);
    END

    DECLARE @DT_Cadastro Datetime = GETDATE();

    IF (ISNULL(@Acao, 'I') = 'I')
    BEGIN
      IF NOT EXISTS (SELECT 1
                     FROM TB_USUARIO WITH (NOLOCK)
                     WHERE USU_Email = @USU_Email)
      BEGIN
        INSERT INTO TB_USUARIO (USU_Perfil
                               ,USU_Email
                               ,USU_Senha
                               ,USU_DataCadastro
                               ,USU_Status)

        VALUES (@USU_Perfil
               ,@USU_Email
               ,@USU_Senha
               ,@DT_Cadastro
               ,@USU_Status)

        SET @UsuarioId = SCOPE_IDENTITY();
      END
      ELSE
      BEGIN
        SELECT @Return_Code = 2
              ,@ErrorMsg    = 'O email informado já está cadastrado.';
        RAISERROR(@ErrorMsg, 18, 1);
      END
    END

    IF (ISNULL(@Acao, 'I') = 'U')
    BEGIN
      IF EXISTS (SELECT 1
                 FROM TB_USUARIO WITH(NOLOCK)
                 WHERE UsuarioId = @UsuarioId
                   AND USU_Email = @USU_Email)
      BEGIN
        UPDATE TB_USUARIO
        SET USU_Perfil       = @USU_Perfil
           ,USU_Email        = @USU_Email
           ,USU_Senha        = @USU_Senha
           ,USU_DataCadastro = @USU_DataCadastro
           ,USU_Status       = @USU_Status
        WHERE UsuarioId = @UsuarioId;
      END
      ELSE
      BEGIN
        SELECT @Return_Code = 2
              ,@ErrorMsg    = 'Usuáio não encontrado!';
        RAISERROR(@ErrorMsg, 18, 1);
      END
    END

    IF (ISNULL(@Acao, 'I') = 'D')
    BEGIN
      IF EXISTS (SELECT 1
                 FROM TB_USUARIO WITH(NOLOCK)
                 WHERE UsuarioId = @UsuarioId)
      BEGIN           
        DELETE FROM TB_USUARIO
        WHERE UsuarioId = @UsuarioId
      END
      ELSE
      BEGIN
        SELECT @Return_Code = 2
              ,@ErrorMsg    = 'Usuário não encontrado';
        RAISERROR(@ErrorMsg, 18, 1);
    END
    END    
    IF (@@TRANCOUNT > 0) COMMIT TRANSACTION;
  END TRY

  BEGIN CATCH
    IF (@@TRANCOUNT > 0) ROLLBACK TRANSACTION;

    IF (@Return_Code = 0)
    BEGIN
      SELECT @Return_Code = 1
            ,@ErrorMsg    = 'Erro inesperado na st_Movto_Usuario: ' + ERROR_MESSAGE();
    END
  END CATCH

RETURN;
END