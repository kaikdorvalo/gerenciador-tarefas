export enum Errors {
    INVALID_EMAIL_ADDRESS = "Invalid Email Address",
    INVALID_EMAIL_ADDRESS_OR_PASSWORD = "Invalid Email Address or Password",
    EMAIL_ALREADY_IN_USE = "Email Already In Use",
    PASSWORD_LENGTH = "Password Must Be 8 Or More Characters Long",
    INVALID_PHOTO_URL = "Invalid Photo URL",
    MISSING_USER_INFORMATIONS = "Can't Create User: Informations Missing",
    START_DATE_AND_END_DATE = 'Start Date Cannot Be Greater Than The End Date',
    INVALID_TASK_STATUS = 'Invalid Task Status',
    INVALID_TASK_CATEGORY = 'Invalid Task Category',
    MISSING_TASK_INFORMATIONS = "Can't Create Task: Informations Missing",
    INVALID_USER_CATEGORY = "Invalid User Category",
    CATEGORY_NAME_ALREADY_EXISTS = "This Category Name Already Exists",
    CATEGORY_HEXADECIMAL_COLOR = "The Category Color Must Be Hexadecimal",
    EMPTY_CATEGORY_NAME = "Category Name Must Not Be Empty",
    CREATE_CATEGORY_ERROR = "Unable To Create Category, Please Try Again",
    TASK_NOT_FOUND = "Task Not Found",
    CATEGORY_NOT_FOUND = "Category Not Found"
}