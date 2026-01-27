import { test, expect, APIRequestContext } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'

const taskName = 'teste ler um livro'

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    // Dado que eu tenha uma nova tarefa

    await deleteTaskByHelper(request, taskName)

    // E que estou na página de cadastro
    await page.goto('http://localhost:8080/')

    // Quando faço o cadastro dessa tarefa
    const inputTaskName = page.locator('input[class*=InputNewTask]')
    //await inputTaskName.fill(faker.lorem.words())// utilizando faker para perrencher o campo com www.npmjs.com, gerar dados faker, pesquisar faker e clicar em @faker-js/faker, baixar a biblioteca  yarn add @faker-js/faker -d
    await inputTaskName.fill(taskName)
    //await page.fill('#newTask', 'Ler um Livro') //'identificar por id e pressncher campo
    //await page.fill('input[class*=InoutNewTadk]', 'Ler um Livro em tyoescript') //'identificar por class e pressncher campo

    //await inputTaskName.press('Enter')//.press simula tecla do teclado
    await page.click('xpath=//button[contains(text(), "Create")]')// click no botão com xpath
    //await page.click('css=button >> text=Create') // outra forma click no botão

    // Então essa tarefa dese ser exibida n alista
    const target = page.locator('css=.task-item p >> text=' + taskName)
    await expect(target).toBeVisible()

})

test('não dever permitir tarefa duplicada', async ({ page, request }) => {
    const task: TaskModel = {
        name: taskName,
        is_done: false
    }

    await deleteTaskByHelper(request, taskName)
    await postTask(request, task)
    

    await page.goto('http://localhost:8080/')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(taskName)
    await page.click('css=button >> text=Create')

    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')
})