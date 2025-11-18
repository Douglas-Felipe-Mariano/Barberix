CREATE PROCEDURE st_CadCliente (@Nome         Varchar(100)
                               ,@Telefone     Varchar(16)
                               ,@Email        Varchar(100)
                               ,@Endereco     Varchar(255)
                               ,@ClienteId    Integer      = NULL OUTPUT
                               ,@Return_Code  Smallint     = 0    OUTPUT
                               ,@ErrorMsg     Varchar(255) = ''   OUTPUT)
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRY
    SELECT @Return_Code = 0
          ,@ErrorMsg    = '';

    IF (ISNULL(@Nome, '')     = '') SET @ErrorMsg += Char(13) + 'Nome';
    IF (ISNULL(@Telefone, '') = '') SET @ErrorMsg += Char(13) + 'Telefone';
    IF (ISNULL(@Email, '')    = '') SET @ErrorMsg += Char(13) + 'Email';
    IF (ISNULL(@Endereco, '') = '') SET @ErrorMsg += Char(13) + 'Endereco';

    IF (@ErrorMsg <> '')
    BEGIN
      SELECT @Return_Code = 2
            ,@ErrorMsg    = 'st_CadCliente: Campos obrigatórios não preenchidos: ' + @ErrorMsg;
      RAISERROR(@ErrorMsg, 18, 1);
    END

    DECLARE @DT_Cadastro Datetime = GETDATE();

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

  END TRY

  BEGIN CATCH
    IF (@Return_Code = 0)
    BEGIN
      SELECT @Return_Code = 1
            ,@ErrorMsg    = 'Erro inesperado ao cadastrar cliente: ' + ERROR_MESSAGE();
    END

  END CATCH

  RETURN;
END