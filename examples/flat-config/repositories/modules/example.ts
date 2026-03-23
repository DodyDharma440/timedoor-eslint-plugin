import FetchFactory from "../../factory";

interface IList {
  query?: {
    status?: string;
    "date[]"?: string[];

    // Default
    search?: string;
    page?: number;
    limit?: number;
  };
}

interface IDetail {
  params: {
    paylaterId: string | number;
  };
}

interface IStore extends IDetail {
  body: {
    // amount: string | number
  };
}

const useSomeComposable = async () => {
  const { data } = await useAsyncData(() => {
    return super.call("/api/cms/paylater", {
      method: "GET",
      query,
    });
  });
};

class PaylaterModule extends FetchFactory<any> {
  async list(payload) {
    const { query } = payload;

    return super.call("/api/cms/paylater", {
      method: "GET",
      query,
    });
  }

  detail = async (payload: IDetail): Promise<ApiResponse<any>> => {
    const { params } = payload;
    const cookie = useCookie("token");
    const { $api } = useNuxtApp();

    return await useAsyncData(() => {
      return super.call(`/api/cms/paylater/${params.paylaterId}`, {
        method: "GET",
      });
    });
  };

  async store(payload: IStore) {
    const { params, body } = payload;

    return super.call(`/api/cms/paylater/${params.paylaterId}/invoice`, {
      method: "POST",
      body,
    });
  }

  async summary(payload: IList) {
    const { query } = payload;

    return super.call("/api/cms/paylater/summary", {
      method: "GET",
      query,
    });
  }
}

export default PaylaterModule;
