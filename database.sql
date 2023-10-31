CREATE TABLE `login` (
	`NomeDeUsuario` VARCHAR(50) NULL DEFAULT 'Usuario' COLLATE 'utf8mb4_general_ci',
	`SenhaDoUsuario` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`EmailDoUsuario` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`ip_address` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Plano` VARCHAR(50) NULL DEFAULT 'Nenhum' COLLATE 'utf8mb4_general_ci',
	`LogosRestantes` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`DataDeCompra` DATE NULL DEFAULT NULL
)
COMMENT='Login para o cliente.'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
