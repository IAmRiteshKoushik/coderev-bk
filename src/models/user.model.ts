export interface User {
    firstName: string,
    lastName: string,
    email: string,
    projects: number,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    accountStatus: number
}

// Whenever there is an edit of user profile, the last updated time 
// needs to be updated as well. For this, the following type is created
export type NameUpdateModel = {
    firstName: string,
    lastName: string,
    updatedAt: Date
}

