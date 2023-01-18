|User story|Acceptance criteria|
|----------|-------------------|
|US-01|1. Login's Frontend route must ask fill the following fields: a. Full Name, b. Username, c. Email. d. Password|
|-|2. Frontend must validate each field based on following criteria: **a)** Full Name must not have a length greater than 100 and it can't include non alphabetic characters. **b)** username's length must be less than 20, can include numbers and it can have up to three special characters. **c)** password must have 2 uppercase, 2 special characters of the following list (!@#$%()&_-+/?¿*) and a string length between 8 and 32, **d)** Email must have @ and at least 1 dot but not more than 2... accepted domains? |
|-|3. Backend must verify if email and username are not registered in database| 
|-|4. Once a user submits the required form, backend must sent a verification code and a route to confirm his/her email|
|-|5. Frontend must display a terms of use and privacy page and send the filled form just when user accepts the TOU conditions|

---

|User story|Acceptance criteria|
|----------|-------------------|
|US-02|1. Backend must verifiy if username exists in database|
|-|2. Backend must verifiy if username login Ip is included in colombian ip |
|-|3. Backend must verify if the given password is equal to stored chypered password|
|-|4. Frontend must validate filled form fields in accordance with the requirements discussed in acceptance criteria of user story No. 1   |
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-03|1. User must fill a form with all task info|
|-|2. Frontend must verify if the date, time, duration provided by the user are the same or overlap with another task/appointment. In case of that happens, frontend must display a message with the tasks that the new one overlaps and ask for confirmation|
|-|3. Frontend must display a list of task and appointments already schedule for the date range choose by the user|
|-|4. Frontend must include an option to create a limited number of reminders. Max reminders equal to 10 |
|-|5. Frontend must display a notification messange that points out a reminder was successfully created|
|-|6. Frontend must display a list with all reminders created|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-04|Same criteria as US-03|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-05|1. Frontend must pass all US-03 criteria excepts the first criterion|

---
|User story|Acceptance criteria|
|----------|-------------------|
|US-06|1. Frontend must inquire and validate the following inputs: a. date, b. time|
|-|2. In case user has create 10 reminders and want to add one more, frontend must display a message pointing out that user has reached the maximum number of reminders for that task/appointment|
|-| Frontend must display a list of created reminders for the task/appointment|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-7|1. Same criteria as US-06|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-8|1. User can select one or multiple tasks/appointments from their respectives lists|
|-|2. Frontend must display a confirmation message and delete the task/appointment once user has confirmed its deletion|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-9|1. User can select one or multiple reminders from their respectives lists|
|-|2. Frontend must display a confirmation message and delete the task/appointment once user has confirmed its deletion|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-10|1. Frontend must display a list of tags(CATEGORIES) applied to a task or appointment when viewing their details|
|-|2. User can view the list of available categories|
|-|3. User can create a new category to tag. This criterion is only fullfilled when US-11 acceptance criteria have been passed |
|-|4. User can select a different color for each categories. This color must be used when displaying catgory lists or tasks tagged with a specific category |
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-11|1. There must be a specific panel to display the list of available categories and the option to edit one category|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-12|1. User can change name and color of the category. Frontend must display different color options |
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-13|1. Frontend must display a confirmation message and delete the category after user accepted|
|-|2. Backend must remove the deleted category and remove the reference to it from tagged tasks and appointments|
---
|User story|Acceptance criteria|
|----------|-------------------|
|US-14|1. Frontend must show the details of a task or appointment when user select it|





