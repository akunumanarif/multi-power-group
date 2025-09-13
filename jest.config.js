module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@ordersService/(.*)$': '<rootDir>/apps/order-service/src/service/$1',
    '^@ordersDto/(.*)$': '<rootDir>/apps/order-service/src/dto/$1',
    '^@kafka/(.*)$': '<rootDir>/kafka/$1',
    '^@notificationController/(.*)$': '<rootDir>/apps/notification-service/src/controller/$1',
    '^@notificationService/(.*)$': '<rootDir>/apps/notification-service/src/service/$1',
    '^@logger/(.*)$': '<rootDir>/logger/$1',
    // Tambahkan alias lain sesuai kebutuhan project
  },
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
