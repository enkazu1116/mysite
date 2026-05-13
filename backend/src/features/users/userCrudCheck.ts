import {
    createUser,
    deleteUser,
    findUserById,
    updateUser,
} from "./userRepository";

export async function runUserCrudCheck() {
    const suffix = Date.now();
    const created = await createUser({
        user_name: `crud-check-${suffix}`,
        profile: "created by CRUD check",
    });

    if (!created) {
        throw new Error("failed to create user");
    }

    const selected = await findUserById(created.user_id);
    const updated = await updateUser(created.user_id, {
        user_name: `crud-check-updated-${suffix}`,
        profile: "updated by CRUD check",
    });
    const deleted = await deleteUser(created.user_id);
    const selectedAfterDelete = await findUserById(created.user_id);

    return {
        created,
        selected,
        updated,
        deleted,
        selectedAfterDelete,
    };
}
