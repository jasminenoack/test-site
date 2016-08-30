export const matchAccounts = (filter, accounts) => {
    return accounts.filter((account) => {
        return (
            account.user.username.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
            account.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
            (account.id + "").toLowerCase().indexOf(filter.toLowerCase()) !== -1
        );
    });
};
