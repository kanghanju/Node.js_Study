const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        //super.init의 첫번째 인수는 컬럼정리
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        age: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        married: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }, //두번째 인수는 모델에 대한 설정
      {
        sequelize,
        timestamps: false, //timestamps:true면 createdAt,updatedAt을 같이 default로 넣어준다
        underscored: false,
        modelName: "User", //모델이름은 User, JS에서 쓰이는 이름
        tableName: "users", //테이블이름은 users, mysql에서 쓰는 이름
        paranoid: false, //paranoid:true면 deletedAt까지 만들어준다(보통 삭제할때 제거하는게 아니라 deletedAt을만든다)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    //comment의 commenter라는 column이 내 id를 참조하고 있다
    db.User.hasMany(db.Comment, { foreignKey: "commenter", sourceKey: "id" });
  }
};
