---
Date: Thursday 08-10-2023 | 17:44:51
Updated at: Thursday 08-10-2023 | 17:44:54
---

# CQRS - Command Query Responsibility Segregation | Command & Query Seperation
> CQRS is the pattern and architecture we're using to create our CRUD operations.
> : CQRS is concerned with the flow of data.

| Command | Query   |
|-------------- | -------------- |
| Does something| Answers a question|
| Modifies state| Does not modify state|
| Should not return a value| Should return value|

![Alt text](image-3.png)
![Alt text](image-4.png)