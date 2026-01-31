// support/pages/tasks/index.ts
import { Locator, Page, expect } from "@playwright/test"
import { TaskModel } from "../../../fixtures/task.model"

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*=InputNewTask]')
    }

    async go() {
        await this.page.goto('/')
    }

    async create(task: TaskModel) { 
        
        await this.inputTaskName.fill(task.name)
        await this.page.click('css=button >> text=Create')
    }

    async toggle(taskName: string) {
    const target = this.page.locator(`xpath=//p[contains(text(), "${taskName}")]/preceding-sibling::button`);
    await target.click();
}

     async shouldHabeText(taskName: string) {
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

   async remove(taskName: string) {
    const target = this.page.locator(`xpath=//div[@data-testid="task-item"][.//p[text()="${taskName}"]]//button[last()]`);
    await target.click();
}

    async shouldNotExist(taskName: string) {
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).not.toBeVisible()
    }

    async alertHaveText(text: string) {
        const target = this.page.locator('.swal2-html-container')
        await expect(target).toHaveText(text)
    }

    async shouldBeDone(taskName: string) { // Apenas string
        const target = this.page.getByText(taskName)
        await expect(target).toHaveCSS('text-decoration-line', 'line-through');
    }

}