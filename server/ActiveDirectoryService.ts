import fetch from "cross-fetch";
import { config } from "./config";

export class ActiveDirectoryService {
  tokenEndpoint = config.ACTIVE_DIRECTORY.TOKEN_ENDPOINT;

  async getUserPhoto(userId: string): Promise<any> {
    const photoPath = `users/${userId}/photo/$value`;

    const accessToken = await this.requestToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const url = config.ACTIVE_DIRECTORY.GRAPH_ENDPOINT + photoPath;

    try {
      const response = await this.fetchRetry(url, { method: "get", headers });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer.toString("base64");
    } catch (err) {
      console.log(`No profile picture found for ${userId}`);
      throw err;
    }
  }

  async fetchRetry(url: string, config): Promise<any> {
    return await fetch(url, config);
  }

  private async requestToken() {
    const body = this.encodeForm({
      client_id: config.ACTIVE_DIRECTORY.CLIENT_ID,
      client_secret: config.ACTIVE_DIRECTORY.CLIENT_SECRET,
      grant_type: config.ACTIVE_DIRECTORY.CLIENT_CREDENTIALS,
      scope: config.ACTIVE_DIRECTORY.TOKEN_SCOPE,
    });

    const requestConfig: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    };

    console.log(
      `Active directory service - requesting token from ${this.tokenEndpoint}`
    );
    const response = await fetch(this.tokenEndpoint, requestConfig);
    const responseText = await response.text();

    try {
      const responseJson = JSON.parse(responseText);
      const { access_token: accessToken } = responseJson;
      return accessToken;
    } catch (error) {
      console.log("Error decoding response", error);
      console.log(
        `Response headers are ${JSON.stringify(
          response.headers
        )}, body is ${responseText}`
      );
      throw error;
    }
  }

  private encodeForm = (data: any) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  };
}
