import { test, expect, APIRequestContext } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import { text } from 'node:stream/consumers'
import data from './fixtures/tasks.json'

let tasksPage: TasksPage
test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)

})

test.describe('cadastro', () => {
    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {
        // Dado que eu tenha uma nova tarefa
        const taskName = 'teste ler um livro'
        const task = data.sucess as TaskModel
        await deleteTaskByHelper(request, taskName)

        //const tasksPage = new TasksPage(page), já esta instaciado no beforeEach
        await tasksPage.go()
        await tasksPage.create(task)

        // Quando faço o cadastro dessa tarefa
        // await inputTaskName.fill(faker.lorem.words())// utilizando faker para perrencher o campo com www.npmjs.com, gerar dados faker, pesquisar faker e clicar em @faker-js/faker, baixar a biblioteca  yarn add @faker-js/faker -d
        // await page.fill('#newTask', 'Ler um Livro') //'identificar por id e pressncher campo
        // await page.fill('input[class*=InoutNewTadk]', 'Ler um Livro em tyoescript') //'identificar por class e pressncher campo
        // await inputTaskName.press('Enter')//.press simula tecla do teclado
        // await page.click('css=button >> text=Create') // outra forma click no botão
        // Então essa tarefa dese ser exibida n alista
        await tasksPage.shouldHabeText(task.name)
    })

    test('não dever permitir tarefa duplicada', async ({ request }) => {

        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        //const tasksPage = new TasksPage(page), já esta instaciado no beforeEach
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo aobrigatório', async () => {

        const task = data.riquered as TaskModel

        //const tasksPage = new TasksPage(page), já esta instaciado no beforeEach
        await tasksPage.go()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        //validationMessage para validar a mensagem de um campo required
        expect(validationMessage).toEqual('This is a required field')

    })

})

test.describe('atualização', () => {

    test('deve concluir uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        //const tasksPage = new TasksPage(page), já esta instaciado no beforeEach
        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)

    })

    test.describe('exclusão', () => {
        test('deve excluir uma tarefa', async ({ request }) => {
            const task = data.delete as TaskModel

            await deleteTaskByHelper(request, task.name)
            await postTask(request, task)

            //const tasksPage = new TasksPage(page), já esta instaciado no beforeEach
            await tasksPage.go()
            await tasksPage.remove(task.name)
            await tasksPage.shouldNotExist(task.name)

        })
    })

})