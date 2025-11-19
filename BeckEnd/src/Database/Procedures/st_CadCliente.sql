CREATE PROCEDURE st_Movto_Cliente (@Nome         Varchar(100)
                                  ,@Telefone     Varchar(16)
                                  ,@Email        Varchar(100)
                                  ,@Endereco     Varchar(255)
                                  ,@Acao         Char(1)      = 'I' --// I - Insert | U - Update | D - Delete
                                  ,@ClienteId    Integer      = NULL OUTPUT
                                  ,@Return_Code  Smallint     = 0    OUTPUT
                                  ,@ErrorMsg     Varchar(255) = ''   OUTPUT)
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRANSACTION;

  BEGIN TRY
    SELECT @Return_Code = 0
          ,@ErrorMsg    = '';

    IF (ISNULL(@Nome, '')     = '')  SET @ErrorMsg += Char(13) + 'Nome';
    IF (ISNULL(@Telefone, '') = '')  SET @ErrorMsg += Char(13) + 'Telefone';
    IF (ISNULL(@Email, '')    = '')  SET @ErrorMsg += Char(13) + 'Email';
    IF (ISNULL(@Endereco, '') = '')  SET @ErrorMsg += Char(13) + 'Endereco';
    IF (ISNULL(@Acao, '')     = '')  SET @ErrorMsg += Char(13) + 'Acao';
    IF (ISNULL(@Acao, 'I') 
      IN ('U', 'D') 
      AND ISNULL(@ClienteId, 0) = 0) SET @ErrorMsg += Char(13) + 'ClienteId (obrigatório para Update e Delete)';

    IF (@ErrorMsg <> '')
    BEGIN
      SELECT @Return_Code = 2
            ,@ErrorMsg    = 'st_Movto_Cliente: Campos obrigatórios não preenchidos: ' + @ErrorMsg;
      IF (@@TRANCOUNT > 0) ROLLBACK TRANSACTION;
      RAISERROR(@ErrorMsg, 18, 1);
    END

    DECLARE @DT_Cadastro Datetime = GETDATE();

    IF (ISNULL(@Acao, 'I') = 'I')
    BEGIN
      IF NOT EXISTS (SELECT 1
                     FROM TB_CLIENTE WITH(NOLOCK)
                     WHERE CLI_Email = @Email)
      BEGIN
        INSERT INTO TB_CLIENTE (CLI_NOME
                               ,CLI_Telefone
                               ,CLI_Email
                               ,CLI_DataCadastro
                               ,CLI_Endereco)
        VALUES (@Nome
               ,@Telefone
               ,@Email
               ,@DT_Cadastro
               ,@Endereco);
  
        SET @ClienteId = SCOPE_IDENTITY();
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
                 FROM TB_CLIENTE WITH(NOLOCK)
                 WHERE ClienteId = @ClienteId
                   AND CLI_Email = @Email)
      BEGIN
        UPDATE TB_CLIENTE
        SET CLI_NOME     = @Nome
           ,CLI_Telefone = @Telefone
           ,CLI_Email    = @Email
           ,CLI_Endereco = @Endereco
        WHERE ClienteId  = @ClienteId;
      END
      ELSE
      BEGIN
        SELECT @Return_Code = 2
              ,@ErrorMsg    = 'Cliente não encontrado.';
        RAISERROR(@ErrorMsg, 18, 1);
      END
    END

    IF (ISNULL(@Acao, 'I') = 'D')
    BEGIN
      IF EXISTS (SELECT 1
                 FROM TB_CLIENTE WITH(NOLOCK)
                 WHERE ClienteId = @ClienteId)
      BEGIN
        DELETE FROM TB_CLIENTE
        WHERE ClienteId = @ClienteId;
      END
      ELSE
      BEGIN
        SELECT @Return_Code = 2
              ,@ErrorMsg    = 'Cliente não encontrado.';
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
            ,@ErrorMsg    = 'Erro inesperado na st_Movto_Cliente: ' + ERROR_MESSAGE();
    END

  END CATCH

  RETURN;
END