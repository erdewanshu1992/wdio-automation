pipeline {
    agent any

    tools {
        nodejs "node20"
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
                sh 'PLATFORM=browser npx wdio'
            }
        }
    }
}
