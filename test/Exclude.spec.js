import { mount } from "@vue/test-utils";
import exclude from "@/pages/challenges/exclude.vue";

describe("Exclude.spec.js", () => {
  const wrapper = mount(exclude);

  test("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  test("gets a correct chance to display a cell", () => {
    const lowChance = 7; // 1/7 chance
    const heightChance = 2; // 1/2 chance

    let successLow = 0;
    let successHeight = 0;

    const trys = 1000;

    for (let i = 0; i < trys; i++) {
      if (wrapper.vm.random(lowChance)) successLow++;
      if (wrapper.vm.random(heightChance)) successHeight++;
    }

    expect(successLow / trys).toBeCloseTo(1 / lowChance, 1);
    expect(successHeight / trys).toBeCloseTo(1 / heightChance, 1);
  });
});
