pipeline {
    agent any

    tools {
        nodejs "node20"
    }

    parameters {
        choice(
            name: 'TEST_TYPE',
            choices: [
                'browser', 
                'android-native', 
                'android-web', 
                'ios-native', 
                'ios-web'
            ],
            description: 'Select which WDIO tests to run'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/erdewanshu1992/wdio-automation.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run WDIO Tests') {
            steps {
                script {

                    if (params.TEST_TYPE == 'all') {
                        sh 'PLATFORM=browser npx wdio'
                        sh 'PLATFORM=android ENVIRONMENT=local npx wdio'
                        sh 'PLATFORM=android MOBILE_WEB=true npx wdio'
                        sh 'PLATFORM=ios npx wdio'
                        sh 'PLATFORM=ios MOBILE_WEB=true npx wdio'
                    }

                    if (params.TEST_TYPE == 'browser') {
                        sh 'PLATFORM=browser npx wdio'
                    }

                    if (params.TEST_TYPE == 'android-native') {
                        sh 'PLATFORM=android ENVIRONMENT=local npx wdio'
                    }

                    if (params.TEST_TYPE == 'android-web') {
                        sh 'PLATFORM=android MOBILE_WEB=true npx wdio'
                    }

                    if (params.TEST_TYPE == 'ios-native') {
                        sh 'PLATFORM=ios npx wdio'
                    }

                    if (params.TEST_TYPE == 'ios-web') {
                        sh 'PLATFORM=ios MOBILE_WEB=true npx wdio'
                    }
                }
            }
        }
    }
}
