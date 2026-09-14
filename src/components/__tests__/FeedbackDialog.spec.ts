import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import FeedbackDialog from "../FeedbackDialog.vue";
import { FORMSPREE_ENDPOINT } from "@/constants/appInfo";

describe("FeedbackDialog.vue Component", () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (wrapper) {
      wrapper.unmount();
    }
    document.body.innerHTML = "";
  });

  it("renders form elements when open is true", async () => {
    wrapper = mount(FeedbackDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    expect(document.body.textContent).toContain("Report Bug & Suggestions");
    expect(document.body.textContent).toContain("Feedback Type");
    expect(document.body.textContent).toContain("Bug Report");
    expect(document.body.textContent).toContain("Feature Suggestion");
    expect(document.body.textContent).toContain("Question / Other");
    expect(document.body.querySelector("input#feedback-email")).not.toBeNull();
    expect(document.body.querySelector("textarea#feedback-message")).not.toBeNull();
  });

  it("switches feedback category when clicking category buttons", async () => {
    wrapper = mount(FeedbackDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const buttons = Array.from(document.body.querySelectorAll("button"));
    const suggestionBtn = buttons.find((b) => b.textContent?.includes("Feature Suggestion"));
    expect(suggestionBtn).toBeDefined();

    suggestionBtn?.click();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).category).toBe("suggestion");
  });

  it("submits feedback successfully to Formspree endpoint and shows success screen", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    wrapper = mount(FeedbackDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Fill form
    const emailInput = document.body.querySelector("input#feedback-email") as HTMLInputElement;
    const messageInput = document.body.querySelector("textarea#feedback-message") as HTMLTextAreaElement;

    emailInput.value = "tester@example.com";
    emailInput.dispatchEvent(new Event("input"));
    messageInput.value = "Ada kendala pada tampilan kanvas di perangkat mobile";
    messageInput.dispatchEvent(new Event("input"));

    await wrapper.vm.$nextTick();

    // Submit form
    const form = document.body.querySelector("form") as HTMLFormElement;
    form.dispatchEvent(new Event("submit"));

    await wrapper.vm.$nextTick();
    await new Promise((r) => setTimeout(r, 50));
    await wrapper.vm.$nextTick();

    expect(fetchMock).toHaveBeenCalledWith(
      FORMSPREE_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    );

    const callBody = fetchMock.mock.calls[0][1].body as FormData;
    expect(callBody.get("message")).toBe("Ada kendala pada tampilan kanvas di perangkat mobile");
    expect(callBody.get("email")).toBe("tester@example.com");
    expect(callBody.get("category")).toBe("bug");
    expect(callBody.get("appVersion")).toBeDefined();

    // Success screen should be rendered
    expect(document.body.textContent).toContain("Thank You So Much!");
  });

  it("displays error message when Formspree submission fails with errors array", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        errors: [{ message: "Bad form post request" }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    wrapper = mount(FeedbackDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const messageInput = document.body.querySelector("textarea#feedback-message") as HTMLTextAreaElement;
    messageInput.value = "Testing error flow";
    messageInput.dispatchEvent(new Event("input"));

    await wrapper.vm.$nextTick();

    const form = document.body.querySelector("form") as HTMLFormElement;
    form.dispatchEvent(new Event("submit"));

    await wrapper.vm.$nextTick();
    await new Promise((r) => setTimeout(r, 50));
    await wrapper.vm.$nextTick();

    expect(document.body.textContent).toContain("Submission Failed");
    expect(document.body.textContent).toContain("Bad form post request");
  });

  it("emits update:open false when clicking top close button", async () => {
    wrapper = mount(FeedbackDialog, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const closeBtn = document.body.querySelector("button.bg-rose-400") as HTMLButtonElement;
    expect(closeBtn).not.toBeNull();

    closeBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });
});
