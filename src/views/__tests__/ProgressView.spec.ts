import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ProgressView from "../ProgressView.vue";
import { useProgressStore } from "@/stores/progress";

// Mock vue-router
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

// Mock toast from vue-sonner
vi.mock("vue-sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

import { toast } from "vue-sonner";

describe("ProgressView.vue component/integration tests", () => {
  let pinia: any;
  let store: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock LocalStorage
    let localStorageStore: Record<string, string> = {};
    const localStorageMock = {
      getItem: vi.fn((key: string) => localStorageStore[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageStore[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageStore[key];
      }),
      clear: vi.fn(() => {
        localStorageStore = {};
      }),
      length: 0,
      key: vi.fn()
    };
    vi.stubGlobal("localStorage", localStorageMock);

    // Setup Pinia
    pinia = createPinia();
    setActivePinia(pinia);
    store = useProgressStore();
  });

  const mountProgressView = () => {
    return mount(ProgressView, {
      global: {
        plugins: [pinia],
        stubs: {
          NeoBrutalistButton: false
        }
      }
    });
  };

  it("calculates progress statistics correctly from store", async () => {
    // Modify store state directly to test statistics calculation
    store.progress["h-a"].hasLearned = true;
    store.progress["h-i"].hasLearned = true;
    store.progress["k-a"].hasLearned = true;

    store.progress["h-a"].quizSuccessCount = 3;
    store.progress["h-a"].quizFailCount = 1;
    store.progress["h-i"].drawSuccessCount = 2;
    store.progress["h-i"].drawFailCount = 0;

    const wrapper = mountProgressView();

    // Hiragana Learned: 2 / 104 characters (h-a and h-i)
    // Katakana Learned: 1
    const textContent = wrapper.text();
    expect(textContent).toContain(`2 / ${(wrapper.vm as any).hiraganaCharacters.length}`);
    expect(textContent).toContain(`1 / ${(wrapper.vm as any).katakanaCharacters.length}`);

    // Accuracy stats
    // Quiz success ratio: 3/4 = 75%
    // Writing success ratio: 2/2 = 100%
    expect(textContent).toContain("75%");
    expect(textContent).toContain("100%");
  });

  it("filters character list correctly based on search query", async () => {
    const wrapper = mountProgressView();
    
    // Default displays all characters (filteredCharacters)
    const rowsBefore = wrapper.findAll("tbody tr");
    expect(rowsBefore.length).toBeGreaterThan(5);

    // Search query for a specific romaji 'ki'
    const searchInput = wrapper.find("input[type='text']");
    await searchInput.setValue("ki");

    // Table rows should filter down to elements matching 'ki'
    const rowsAfter = wrapper.findAll("tbody tr");
    expect(rowsAfter.length).toBeLessThan(rowsBefore.length);
    
    // Rows should contain romaji 'KI'
    const tableText = wrapper.find("tbody").text();
    expect(tableText).toContain("KI");
  });

  it("toggles learned state directly from the list badge button", async () => {
    const wrapper = mountProgressView();

    // Find the status button for the first character row
    const firstRowStatusBtn = wrapper.find("tbody tr button");
    expect(firstRowStatusBtn.exists()).toBe(true);

    // Initial state is not learned
    expect(store.progress["h-a"].hasLearned).toBe(false);

    // Click to toggle
    await firstRowStatusBtn.trigger("click");
    expect(store.progress["h-a"].hasLearned).toBe(true);

    // Click again to toggle back
    await firstRowStatusBtn.trigger("click");
    expect(store.progress["h-a"].hasLearned).toBe(false);
  });

  it("shows danger zone and prompts confirmation modal on reset click", async () => {
    const wrapper = mountProgressView();

    // Reset modal should not be visible initially
    expect(wrapper.find(".fixed.inset-0").exists()).toBe(false);

    // Find and click reset button in danger zone
    const resetTriggerBtn = wrapper.find("section.border-rose-500 button");
    expect(resetTriggerBtn.text()).toContain("Reset");
    await resetTriggerBtn.trigger("click");

    // Modal overlay should be rendered
    const modal = wrapper.find(".fixed.inset-0");
    expect(modal.exists()).toBe(true);
    expect(modal.text()).toContain("Reset");

    // Click cancel button to dismiss
    const cancelBtn = modal.findAll("button")[0];
    await cancelBtn.trigger("click");
    expect(wrapper.find(".fixed.inset-0").exists()).toBe(false);

    // Click reset again and confirm
    await resetTriggerBtn.trigger("click");
    const confirmBtn = wrapper.find(".fixed.inset-0").findAll("button")[1];
    
    // Spy on store action
    const resetSpy = vi.spyOn(store, "resetProgress");
    await confirmBtn.trigger("click");

    expect(resetSpy).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith({ name: "home" });
  });
});
