// *****************************************************************************
// Authentication user class
// *****************************************************************************

export class User {

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  readonly _id: string;
  username    : string;
  roleID      : string;
  password?   : string;
  email       : string;
  firstName   : string;
  lastName    : string;

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(objUser_u?: any) {
    this.resetUser();

    if (!objUser_u) {
      return;
    }

    this._id       = objUser_u._id;
    this.username  = objUser_u.username;
    this.roleID    = objUser_u.roleID;
    this.password  = objUser_u.password;
    this.email     = objUser_u.email;
    this.firstName = objUser_u.firstName;
    this.lastName  = objUser_u.lastName;
  }

  // *****************************************************************************

  resetUser() {
    this.username  = '';
    this.roleID    = '';
    this.password  = '';
    this.email     = '';
    this.firstName = '';
    this.lastName  = '';
  }

  // *****************************************************************************
}

// *****************************************************************************
