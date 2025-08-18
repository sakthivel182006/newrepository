
#!/bin/bash

# Create unique database name from request ID
DATABASE_NAME="9a8816a7_f944_417c_b621_880c521e5fc9"

# Project output directory
OUTPUT_DIR="/home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp"

# Create database
mysql -u root -pexamly -e "CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};" 2>/dev/null || echo "Database creation failed, will use default"

# Generate Spring Boot project using Spring CLI
spring init \
  --type=maven-project \
  --language=java \
  --boot-version=3.4.0 \
  --packaging=jar \
  --java-version=17 \
  --groupId=com.examly \
  --artifactId=springapp \
  --name="Insurance Claim Processing System" \
  --description="Spring Boot backend for Insurance Claim Processing application" \
  --package-name=com.examly.springapp \
  --dependencies=web,data-jpa,validation,mysql,lombok \
  --build=maven \
  ${OUTPUT_DIR}

# Wait for project generation to complete
sleep 5

# Add MySQL configuration to application.properties
mkdir -p ${OUTPUT_DIR}/src/main/resources
cat > "${OUTPUT_DIR}/src/main/resources/application.properties" << EOL
spring.datasource.url=jdbc:mysql://localhost:3306/${DATABASE_NAME}?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=examly
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
EOL

# Create basic package structure
mkdir -p ${OUTPUT_DIR}/src/main/java/com/examly/springapp/model
mkdir -p ${OUTPUT_DIR}/src/main/java/com/examly/springapp/controller
mkdir -p ${OUTPUT_DIR}/src/main/java/com/examly/springapp/service
mkdir -p ${OUTPUT_DIR}/src/main/java/com/examly/springapp/repository
mkdir -p ${OUTPUT_DIR}/src/main/java/com/examly/springapp/exception

# Add additional dependencies to pom.xml for validation and exception handling
sed -i '/<\/dependencies>/i \
    <dependency>\
        <groupId>org.springframework.boot</groupId>\
        <artifactId>spring-boot-starter-validation</artifactId>\
    </dependency>' ${OUTPUT_DIR}/pom.xml
