
import { test, expect } from '@playwright/test';

test.describe('Tela de Clientes', () => {
  test.beforeEach(async ({ page, request }) => {

    const resposta = await request.post('http://localhost:3000/__reset');
    expect(resposta.status()).toBe(204);

    await page.goto('/');
    await page.getByRole('button', { name: 'Clientes' }).click();
  });

  test('C1: Listar os clientes iniciais', async ({ page }) => {

    await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible();

    const linhas = page.getByRole('row');
    await expect(linhas).toHaveCount(3);


    await expect(page.getByRole('cell', { name: 'Ana Souza' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Bruno Lima' })).toBeVisible();
  });

  test('C2: Cadastrar um cliente novo', async ({ page }) => {
    await page.getByLabel('Nome').fill('Carla Dias');
    await page.getByLabel('Email').fill('carla@email.com');
    await page.getByRole('button', { name: 'Cadastrar' }).click();


    await expect(page.getByRole('cell', { name: 'Carla Dias' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'carla@email.com' })).toBeVisible();

    await expect(page.getByLabel('Nome')).toHaveValue('');
    await expect(page.getByLabel('Email')).toHaveValue('');
  });

  test('C3: Validar campos obrigatórios', async ({ page }) => {
    await page.getByRole('button', { name: 'Cadastrar' }).click();

   
    await expect(page.locator('p.erro')).toHaveText('Nome e email sao obrigatorios');


    await expect(page.getByRole('row')).toHaveCount(3);
  });

 
  test('C4: Impedir email duplicado', async ({ page }) => {
    await page.getByLabel('Nome').fill('Teste');
    await page.getByLabel('Email').fill('ana@email.com');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.locator('p.erro')).toHaveText('Email ja cadastrado');
    await expect(page.getByRole('row')).toHaveCount(3);
  });

  test('C5: Editar um cliente', async ({ page }) => {
    const linhaBruno = page.getByRole('row', { name: /Bruno Lima/ });
    await linhaBruno.getByRole('button', { name: 'Editar' }).click();

    await expect(page.getByLabel('Nome')).toHaveValue('Bruno Lima');
    await expect(page.getByLabel('Email')).toHaveValue('bruno@email.com');
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeVisible();

    await page.getByLabel('Nome').fill('Bruno Lima Silva');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page.getByRole('button', { name: 'Cadastrar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).not.toBeVisible();
    await expect(page.getByLabel('Nome')).toHaveValue('');
  });

  test('C6: Cancelar edição', async ({ page }) => {
    const linhaAna = page.getByRole('row', { name: /Ana Souza/ });
    await linhaAna.getByRole('button', { name: 'Editar' }).click();

    await page.getByLabel('Nome').fill('Ana Souza Alterada');
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.getByLabel('Nome')).toHaveValue('');
    await expect(page.getByRole('cell', { name: 'Ana Souza' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Ana Souza Alterada' })).not.toBeVisible();
  });

  test('C7: Editar para um email já usado', async ({ page }) => {
    const linhaBruno = page.getByRole('row', { name: /Bruno Lima/ });
    await linhaBruno.getByRole('button', { name: 'Editar' }).click();

    await page.getByLabel('Email').fill('ana@email.com');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page.locator('p.erro')).toHaveText('Email ja cadastrado');
    await expect(page.getByRole('cell', { name: 'bruno@email.com' })).toBeVisible();
  });

  test('C8: Remover um cliente', async ({ page }) => {
    const linhaBruno = page.getByRole('row', { name: /Bruno Lima/ });
    await linhaBruno.getByRole('button', { name: 'Remover' }).click();


    await expect(page.getByRole('cell', { name: 'Bruno Lima' })).not.toBeVisible();
   
    await expect(page.getByRole('row')).toHaveCount(2);
  });

  test('C9 (desafio): Fluxo completo', async ({ page }) => {
   
    await page.getByLabel('Nome').fill('Diego');
    await page.getByLabel('Email').fill('diego@email.com');
    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await expect(page.getByRole('cell', { name: 'Diego' })).toBeVisible();


    const linhaDiego = page.getByRole('row', { name: /Diego/ });
    await linhaDiego.getByRole('button', { name: 'Editar' }).click();
    await page.getByLabel('Nome').fill('Diego Matos');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByRole('cell', { name: 'Diego Matos' })).toBeVisible();


    await page.getByLabel('Nome').fill('Duplicado');
    await page.getByLabel('Email').fill('diego@email.com');
    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await expect(page.locator('p.erro')).toHaveText('Email ja cadastrado');

    
    const linhaDiegoMatos = page.getByRole('row', { name: /Diego Matos/ });
    await linhaDiegoMatos.getByRole('button', { name: 'Remover' }).click();
    await expect(page.getByRole('cell', { name: 'Diego Matos' })).not.toBeVisible();

    await expect(page.getByRole('row')).toHaveCount(3);
  });
});