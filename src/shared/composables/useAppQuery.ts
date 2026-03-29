import { ref, unref, watchEffect, type Ref } from 'vue';

interface QueryOptions<T> {
  key: unknown;
  query: () => Promise<T>;
}

interface MutationOptions<TPayload, TResult> {
  mutation: (payload: TPayload) => Promise<TResult>;
  onSuccess?: (data: TResult) => void;
}

export function useAppQuery<T>(options: QueryOptions<T>) {
  const data = ref<T | null>(null);
  const error = ref<unknown>(null);
  const isLoading = ref(false);

  async function refetch() {
    isLoading.value = true;
    error.value = null;
    try {
      data.value = await options.query();
    } catch (e) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  }

  watchEffect(() => {
    unref(options.key as Ref<unknown>);
    void refetch();
  });

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}

export function useAppMutation<TPayload, TResult>(options: MutationOptions<TPayload, TResult>) {
  const isLoading = ref(false);
  const error = ref<unknown>(null);

  async function mutate(payload: TPayload) {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await options.mutation(payload);
      options.onSuccess?.(result);
      return result;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    mutate,
    isLoading,
    error,
  };
}
