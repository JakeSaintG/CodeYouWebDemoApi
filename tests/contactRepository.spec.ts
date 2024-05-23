import { ContactRepository } from '../src/repositories/contactRepository';
import fs from 'fs';
import { DbUtils } from '../utils/dbutils';
import { IResponse } from '../src/interfaces/IResponse';
import { IContactRequest } from '../src/interfaces/IContactRequest';

/*
    The following lines is one of many ways to overwrite functions.
    In this case, the goal is to mock/overwrite the fs module used in contactRepository.
*/
jest.mock('fs');
const mockFS: jest.Mocked<typeof fs> = <jest.Mocked<typeof fs>>fs;
jest.mock('../utils/dbutils')
const mockDbUtils: jest.Mocked<typeof DbUtils> = <jest.Mocked<typeof DbUtils>>DbUtils;
/*
    The AAA patten is commonly used in unit tests.
        Arrange - Perform step neccessary to carry out the test. (Mock functions, set variables, etc)
        Act - Call the method or functionality that is under test. Commonly used variables are SUT or SystemUnderTest.
        Assert - Check the results of the SystemUnderTest (referred to as "actual") against the expected results.
*/
it('should return an error if template file not present when resetting data', () => {
    //Arrange
    const dbUtils = new DbUtils(); // Reminder that dbUtils is mocked on line 12 so this instance doesn't do anything.
    const contactRepository = new ContactRepository(dbUtils);
    mockFS.existsSync.mockReturnValue(false);
    const expectedCode = 500;
    const expectedMessage = 'Proper files not in place. POST to the reset endpoint, restart server, or replace files to proceed.';

    //Act
    const SystemUnderTest = contactRepository.ensureDataFilesExist() as IResponse;

    //Assert
    const actualCode = SystemUnderTest.code;
    const actualMessage = SystemUnderTest.message;
    expect(actualCode).toEqual(expectedCode);
    expect(actualMessage).toEqual(expectedMessage);
});

/*
    This one is a little more complicated.
    The test above covered the "fail" scenario for resetContactData(). The "success" case should now be tested.
    Like the test above, it is necessary to mock some of what the fs module is doing: existsSync and readFileSync. 
    After that, "spies" are created to watch the private methods resetDbFromTemplateData() and resetJsonFileFromTemplate().
        It is also possible to overwrite their functionality so they don't actually try to reset anything.
            ".mockImplementation( () => {} )" bascially makes them do nothing.
    The resetContactData() method is then called with the expectation that resetDbFromTemplateData() and resetJsonFileFromTemplate() are as well.
*/
it('should call the private methods involved in resetting files when main reset method is called', async () => {
    //Arrange
    const dbUtils = new DbUtils();
    const contactRepository = new ContactRepository(dbUtils);
    mockFS.existsSync.mockReturnValue(true);
    mockFS.readFileSync.mockReturnValue('[{"foo":"bar"}]');
    const resetDbSpy = jest.spyOn( contactRepository as any, 'resetDbFromTemplate').mockImplementation( () => {} );
    const resetJsonFileSpy = jest.spyOn( contactRepository as any, 'resetJsonFromTemplate').mockImplementation( () => {} );

    //Act
    contactRepository.resetContactData();

    //Assert
    expect(resetJsonFileSpy).toHaveBeenCalled();
    expect(resetDbSpy).toHaveBeenCalled();
});
