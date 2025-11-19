CREATE PROCEDURE st_Movto_Servicos (@SERV_Nome           Varchar(45)
                                   ,@SERV_DuracaoMinutos Integer
                                   ,@SERV_Preco          Numeric(10,2)
                                   ,@ServicoId           Integer      = NULL OUTPUT
                                   ,@Return_Code         Smallint     = 0    OUTPUT
                                   ,@ErrorMsg            Varchar(255) = ''   OUTPUT)
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRANSACTION;
  
  BEGIN TRY
  END TRY

  BEGIN CATCH
    IF (@@TRANCOUNT > 0) ROLLBACK TRANSACTION;

    IF (@Return_Code = 0)
    BEGIN
      SELECT @Return_Code = 1
            ,@ErrorMsg    = 'Erro inesperado na st_Movto_Servicos: ' + ERROR_MESSAGE();
    END
  END CATCH
END