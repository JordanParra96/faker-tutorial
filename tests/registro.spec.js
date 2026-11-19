import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

const DEMO_URL = "https://angular-6-registration-login-example.stackblitz.io";

// Semilla: con el mismo número, faker genera los mismos datos en cada ejecución.
// Cámbiela (o elimínela) para obtener datos distintos.
faker.seed(4103);

/** Un usuario con datos aleatorios pero plausibles. */
function crearUsuario() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    username: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: faker.internet.password({ length: 12 }),
  };
}

test.beforeEach(async ({ page }) => {
  await page.goto(`${DEMO_URL}/register`);
  await page.getByRole("button").click();
});

test("Create an user and login", async ({ page }) => {
  const user = crearUsuario();
  console.log(`Usuario generado: ${JSON.stringify(user)}`);

  await page.locator('input[formcontrolname="firstName"]').fill(user.firstName);
  await page.locator('input[formcontrolname="lastName"]').fill(user.lastName);
  await page.locator('input[formcontrolname="username"]').fill(user.username);
  await page.locator('input[formcontrolname="password"]').fill(user.password);
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.locator("div.alert.alert-success").first()).toBeVisible();

  await page.locator('input[formcontrolname="username"]').fill(user.username);
  await page.locator('input[formcontrolname="password"]').fill(user.password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("heading", { name: `Hi ${user.firstName}!` }),
  ).toBeVisible();
});

test("Reject a password shorter than 6 characters", async ({ page }) => {
  const user = crearUsuario();

  await page.locator('input[formcontrolname="firstName"]').fill(user.firstName);
  await page.locator('input[formcontrolname="lastName"]').fill(user.lastName);
  await page.locator('input[formcontrolname="username"]').fill(user.username);
  await page
    .locator('input[formcontrolname="password"]')
    .fill(faker.string.alphanumeric(5));
  await page.getByRole("button", { name: "Register" }).click();

  await expect(
    page.getByText("Password must be at least 6 characters"),
  ).toBeVisible();
});
