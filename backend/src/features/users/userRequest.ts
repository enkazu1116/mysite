import type {
    CreateUserInput,
    UpdateUserInput,
} from "./userRepository";

type UserBody = {
    user_name?: unknown;
    profile?: unknown;
};

type ParseResult<T> =
    | {
          ok: true;
          data: T;
      }
    | {
          ok: false;
          message: string;
      };

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function toNullableProfile(value: unknown) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return isString(value) ? value : undefined;
}

async function readUserBody(request: Request): Promise<UserBody> {
    return (await request.json()) as UserBody;
}

export async function parseCreateUserInput(
    request: Request,
): Promise<ParseResult<CreateUserInput>> {
    const body = await readUserBody(request);
    const profile = toNullableProfile(body.profile);

    if (!isString(body.user_name) || body.user_name.length === 0) {
        return { ok: false, message: "user_name is required" };
    }

    if (body.profile !== undefined && profile === undefined) {
        return { ok: false, message: "profile must be a string or null" };
    }

    return {
        ok: true,
        data: {
            user_name: body.user_name,
            profile,
        },
    };
}

export async function parseUpdateUserInput(
    request: Request,
): Promise<ParseResult<UpdateUserInput>> {
    const body = await readUserBody(request);
    const profile = toNullableProfile(body.profile);
    const data: UpdateUserInput = {};

    if (body.user_name !== undefined) {
        if (!isString(body.user_name) || body.user_name.length === 0) {
            return { ok: false, message: "user_name must be a non-empty string" };
        }
        data.user_name = body.user_name;
    }

    if (body.profile !== undefined) {
        if (profile === undefined) {
            return { ok: false, message: "profile must be a string or null" };
        }
        data.profile = profile;
    }

    return { ok: true, data };
}
