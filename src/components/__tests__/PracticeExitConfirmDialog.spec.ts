import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import PracticeExitConfirmDialog from "../PracticeExitConfirmDialog.vue";

describe("PracticeExitConfirmDialog.vue Component", () => {
  let wrapper: any;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    document.body.innerHTML = "";
  });

  it("renders modal content when open is true", async () => {
    wrapper = mount(PracticeExitConfirmDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    expect(document.body.textContent).toContain("Leave Practice?");
    expect(document.body.textContent).toContain("A practice session is currently in progress");
    expect(document.body.textContent).toContain("Continue Practice");
    expect(document.body.textContent).toContain("Leave");
  });

  it("emits confirm event when clicking leave button", async () => {
    wrapper = mount(PracticeExitConfirmDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const buttons = Array.from(document.querySelectorAll("button"));
    const leaveBtn = buttons.find((b) => b.textContent?.includes("Leave"));
    expect(leaveBtn).toBeDefined();

    leaveBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("confirm")).toBeTruthy();
  });

  it("emits cancel and update:open false when clicking stay button", async () => {
    wrapper = mount(PracticeExitConfirmDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const buttons = Array.from(document.querySelectorAll("button"));
    const stayBtn = buttons.find((b) => b.textContent?.includes("Continue Practice"));
    expect(stayBtn).toBeDefined();

    stayBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("cancel")).toBeTruthy();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });

  it("emits cancel and update:open false when clicking top close button", async () => {
    wrapper = mount(PracticeExitConfirmDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const closeBtn = document.querySelector("button.bg-rose-400") as HTMLButtonElement;
    expect(closeBtn).not.toBeNull();

    closeBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("cancel")).toBeTruthy();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });
});
