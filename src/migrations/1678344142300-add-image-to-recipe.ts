import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addImageToRecipe1678344142300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
          'recipe',
          new TableColumn({
              name: 'image',
              type: 'varchar',
              isNullable: true,
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('recipe', 'image');
    }

}
