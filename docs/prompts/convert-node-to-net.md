.NET Project is in directory portfolio.net
node project is in directory portfolio.node

Objective: convert node project to .NET

Steps:
1. Analyze the node project
2. Convert the node project to .NET
3. Test the .NET project
4. Deploy the .NET project

1. Analyze the node project
The current node project does not follow proper SOLID and proper CLEAN architecture. It is quite "ad hoc". Still, a global understanding of the project is required.

2. Convert the node project to .NET
For the .NET project, a sample has already been generated. The conversion must follow CLEAN and SOLID principles and use an hexagonal architecture. It should rely on formal proper Dependency Injection.

Every class, enum structure, interface, etc. must be one per file.
Every file must be in the proper directory.

For every file written, a Unit test file must be created in the portfolio.net/tests/unittest directory (with suffix Tests.cs). Everything that is unit testable must be tested.

Every class should be the implementation of an interface and be used through dependency injection.

It is not necessary to keep the same names of the node project, but you should track mappings and conversions between the two projects in a file in /docs/conversion/node-to-net.md.

3. Unit Test the .NET project
It is expected the tests shall work throughout the conversion. 
